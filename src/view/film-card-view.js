import AbstractView from '../framework/view/abstract-view';
import { humanizeReleazeDate } from '../utils/film';

const getButtonStatus = (isActive) => (isActive ? 'film-card__controls-item--active' : '');

const createFilmCardTemplate = (film) => {
  const { comments, filmInfo, userDetails } = film;

  return (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeReleazeDate(filmInfo.release.date)}</span>
        <span class="film-card__duration">${filmInfo.duration}m</span>
        <span class="film-card__genre">${filmInfo.genre.join(', ')}</span>
      </p>
      <img src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="${getButtonStatus(userDetails.watchlist)} film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="${getButtonStatus(userDetails.alreadyWatched)} film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="${getButtonStatus(userDetails.favorite)} film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>
  `);
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #handleFilmCardClick = null;
  #handleWatchedListClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({ film, onFilmCardClick, onWatchlistClick, onAlreadyWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#handleFilmCardClick = onFilmCardClick;
    this.#handleWatchedListClick = onWatchlistClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.film-card__link')
      .addEventListener('click', this.#filmCardClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchedListClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilmCardClick();
  };

  #watchedListClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedListClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
