import { UpdateType, UserAction } from '../const';
import { remove } from '../framework/render';
import { renderUpdateComponent } from '../utils/common';
import FilmCardView from '../view/film-card-view';
import FilmPopupPresenter from './film-popup-presenter';


export default class FilmPresenter {
  #film = null;
  #filmsListContainerComponent = null;
  #filmPopupPresenter = null;
  #filmCardComponent = null;
  #commentsModel = null;
  #handleDataChange = null;


  constructor({ filmsListContainerComponent, commentsModel, onDataChange }) {
    this.#filmsListContainerComponent = filmsListContainerComponent;
    this.#commentsModel = commentsModel;
    this.#handleDataChange = onDataChange;
  }

  get popupPresenter() {
    return this.#filmPopupPresenter;
  }

  init(film) {
    this.#film = film;
    this.#filmPopupPresenter = new FilmPopupPresenter({
      popupContainer: document.body,
      film,
      commentsModel: this.#commentsModel,
      handleWatchlistClick: this.#handleWatchlistClick,
      handleAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      handleFavoriteClick: this.#handleFavoriteClick,
      handleCommentAdd: this.#handleCommentAdd,
      handleCommentDelete: this.#handleCommentDelete,
    });

    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView({
      film,
      onFilmCardClick: this.#handleFilmCardClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    renderUpdateComponent(this.#filmsListContainerComponent, this.#filmCardComponent, prevFilmCardComponent);

    const popupIsRendered = this.#filmPopupPresenter.getRenderedPopup();

    if (popupIsRendered) {
      this.#filmPopupPresenter.resetPopupComponent(popupIsRendered.filmPopupComponent, film);
    }
    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this.#filmCardComponent);
  }

  setAborting(actionType) {
    const openedPopup = this.#filmPopupPresenter.getOpenedPopup();
    if (openedPopup) {
      openedPopup.filmPopupComponent.errShake(actionType);
      return;
    }
    this.#filmCardComponent.shake();
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      this.#film);
  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      this.#film);
  };

  #handleFilmCardClick = () => this.#filmPopupPresenter.renderPopup();


  #handleCommentAdd = (filmId, addedComment) => {
    this.#handleDataChange(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {filmId, addedComment
      }
    );
  };

  #handleCommentDelete = (updatedFilm) => {
    this.#handleDataChange(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      updatedFilm
    );
  };
}
