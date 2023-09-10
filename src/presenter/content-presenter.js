import { render, remove, RenderPosition } from '../framework/render.js';
import FilmsBoardView from '../view/films-board-view';
import FilmsListView from '../view/films-list-view';
import FilmsListContainerView from '../view/films-list-container';
import FooterStatisticsView from '../view/footer-statistics-view';
import SortView from '../view/sort-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter.js';
import FiltersPresenter from './filters-presenter';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


const FILMS_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const siteHeaderContainer = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


export default class ContentPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #showMoreBtnComponent = null;
  #filterModel = null;

  #sortComponent = null;
  #filmsBoardComponent = new FilmsBoardView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #noFilmsComponent = new NoFilmsView();
  #loadingComponent = new LoadingView();

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresentersMap = new Map();
  #filtersPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ filmContainer, filmsModel, commentsModel, filterModel }) {
    this.#filmsContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const filteredFilms = this.#filtersPresenter.filters[filterType].filteredFilms;

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
      default:
        return filteredFilms;
    }
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderFilmsBoard();
    this.#renderLoading();
  }

  clearFilmList({resetSortType = false} = {}) {
    this.#filmPresentersMap.forEach((presenter) => presenter.destroy());
    this.#filmPresentersMap.clear();

    remove(this.#showMoreBtnComponent);
    this.#renderShowMoreBtn();

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
      this.#setActiveSortButton(this.#sortComponent.element.querySelector('.sort__button[data-sort-type="default"]'));
    }
  }

  #setActiveSortButton(button) {
    this.#sortComponent.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    button.classList.add('sort__button--active');
  }

  #renderFilters() {
    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filmsContainer,
      siteHeaderContainer,
      filterModel: this.#filterModel,
      filmsModel: this.#filmsModel
    });
    this.#filtersPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#filmsContainer);
  }

  #renderShowMoreBtn() {
    this.#showMoreBtnComponent = new ShowMoreBtnView({
      onClick: this.#handleShowMoreBtnClick
    });
    render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
  }

  #renderNoFilms() {
    render(this.#noFilmsComponent, this.#filmsContainer);
  }

  #renderFooterStatistics() {
    render(new FooterStatisticsView({
      filmsCount: this.#filmsModel.films.length
    }), siteFooterElement);
  }

  #renderFilmCard(film) {
    const filmPresenter = new FilmPresenter({
      filmsListContainerComponent: this.#filmsListContainerComponent.element,
      commentsModel: this.#commentsModel,
      currentFilter: this.#filterModel.filter,
      onDataChange: this.#handleViewAction,
    });
    filmPresenter.init(film);
    this.#filmPresentersMap.set(film.id, filmPresenter);
  }

  #renderFilmCards(from, to) {
    this.films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  }

  #clearFilmsList() {
    this.#filmPresentersMap.forEach((presenter) => presenter.destroy());
    this.#filmPresentersMap.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;

    remove(this.#showMoreBtnComponent);
  }

  #renderFilmsList() {
    render(this.#filmsListComponent, this.#filmsBoardComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilmCards(0, Math.min(this.films.length, FILMS_COUNT_PER_STEP));

    if (this.films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreBtn();
    }
  }

  #renderFilmsBoard() {
    render(this.#filmsBoardComponent, this.#filmsContainer);

    const films = this.#filmsModel;
    const filmsCount = films.length;
    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmsList();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          this.#filmsModel.updateFilm(updateType, update);
          if (this.films.length === 0) {
            this.#renderNoFilms();
          }
        } catch (err) {
          this.#filmPresentersMap.get(update.id)?.setAborting(actionType);
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#commentsModel.addComment(updateType, update);
        } catch (err) {
          this.#filmPresentersMap.get(update.id)?.setAborting(actionType);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          this.#commentsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#filmPresentersMap.get(update.id)?.setAborting(actionType);
        }
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresentersMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.clearFilmList();
        this.#renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this.clearFilmList({resetSortType: true});
        remove(this.#showMoreBtnComponent);
        this.#renderFilmsBoard();
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        this.#renderFilmsBoard();
        this.#renderFooterStatistics();
        break;
    }
  };

  #handleShowMoreBtnClick = () => {
    this.#renderFilmCards(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.films.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleSortTypeChange = (button, sortType) => {
    this.#clearFilmsList();
    this.#currentSortType = sortType;
    this.#setActiveSortButton(button);
    this.#renderFilmsBoard();
  };

}
