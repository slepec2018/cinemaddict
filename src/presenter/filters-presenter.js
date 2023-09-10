import { FilterType, UpdateType } from '../const.js';
import { remove } from '../framework/render.js';
import { renderUpdateComponent } from '../utils/common.js';
import FiltersView from '../view/filters-view.js';
import UserProfileView from '../view/user-profile-view.js';


export default class FiltersPresenter {
  #userRaitingContainer = null;
  #filtersContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #userProfileComponent = null;
  #filterComponent = null;

  constructor({filtersContainer, siteHeaderContainer, filterModel, filmsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#userRaitingContainer = siteHeaderContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    const filters = {
      all: {
        type: FilterType.ALL,
        name: 'All movies',
        emptyFilmsMessage: 'There are no movies in our database',
        filteredFilms: [...films]
      },
      watchlist: {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        emptyFilmsMessage: 'There are no movies to watch now',
        filteredFilms: []
      },
      history: {
        type: FilterType.HISTORY,
        name: 'History',
        emptyFilmsMessage: 'There are no watched movies now',
        filteredFilms: []
      },
      favorites: {
        type: FilterType.FAVORITE,
        name: 'Favorites',
        emptyFilmsMessage: 'There are no favorite movies now',
        filteredFilms: []
      }
    };

    films.forEach((film) => {
      if (film.userDetails.watchlist) {
        filters.watchlist.filteredFilms.push(film);
      }
      if (film.userDetails.alreadyWatched) {
        filters.history.filteredFilms.push(film);
      }
      if (film.userDetails.favorite) {
        filters.favorites.filteredFilms.push(film);
      }
    });

    return filters;
  }

  init() {
    const filters = this.filters;
    const prevUserRankComponent = this.#userProfileComponent;
    const prevFilterComponent = this.#filterComponent;

    const watchedFilmsCount = filters.history.filteredFilms.length;

    this.#userProfileComponent = new UserProfileView({ watchedFilmsCount });

    this.#filterComponent = new FiltersView({
      filters,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    renderUpdateComponent(this.#userRaitingContainer, this.#userProfileComponent, prevUserRankComponent);
    renderUpdateComponent(this.#filtersContainer, this.#filterComponent, prevFilterComponent);

    if (watchedFilmsCount === 0) {
      remove(this.#userProfileComponent);
      this.#userProfileComponent = null;
    }

  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
