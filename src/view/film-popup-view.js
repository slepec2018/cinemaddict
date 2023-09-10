import he from 'he';
import { EMOTIONS } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizePopupReleaseDate, humanizePopupCommentDate } from '../utils/film';

const DEFAULT_EMOJI = EMOTIONS[0];

const createCommentsTemplate = (comments) => (`
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
      ${comments.map((comment) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment.comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${humanizePopupCommentDate(comment.date)}</span>
      <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
    </p>
  </div>
</li>`).join('')}
</ul>
`);

const createCommentFormTemplate = (commentEmoji) => (`
<div class="film-details__add-emoji-label">
<img src="./images/emoji/${commentEmoji}.png" width="30" height="30" alt="emoji">
</div>
<label class="film-details__comment-label">
<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here"
  name="comment"></textarea>
</label>
<div class="film-details__emoji-list">
${EMOTIONS.map((emotion) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}"
    value="${emotion}" ${emotion === commentEmoji ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>
`).join('')}
</div>
`);

const createFilmPopupTemplate = (film) => {
  const { filmInfo, comments, userDetails, commentEmoji} = film;

  const commentsTemplate = createCommentsTemplate(comments);
  const comentFormTemplate = createCommentFormTemplate(commentEmoji);

  return (`
  <section class="film-details">
  <div class="film-details__inner">
  <div class="film-details__top-container">
    <div class="film-details__close">
    <button class="film-details__close-btn" type="button">close</button>
  </div>
  <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="${filmInfo.alternativeTitle}">
        <p class="film-details__age">${filmInfo.ageRating}</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${filmInfo.title}</h3>
            <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${filmInfo.totalRating}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tbody><tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${filmInfo.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizePopupReleaseDate(filmInfo.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Duration</td>
            <td class="film-details__cell">${filmInfo.duration} m</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              <span class="film-details__genre">${filmInfo.genre.join(', ')}</span>
            </td>
          </tr>
        </tbody></table>
        <p class="film-details__film-description">
        ${filmInfo.description}
        </p>
      </div>
    </div>
    <section class="film-details__controls">
      <button type="button" class=" film-details__control-button ${userDetails.watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist " id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class=" film-details__control-button ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched " id="watched" name="watched">Already watched</button>
      <button type="button" class=" film-details__control-button ${userDetails.favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite " id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
  
    ${commentsTemplate}
      <form class="film-details__new-comment" action="" method="get">
    ${comentFormTemplate}
    </form>
  </section>
  </div>
  `);
};

export default class FilmPopupView extends AbstractStatefulView {

  #handleCloseBtnClick = null;
  #handleWatchlistClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;
  #handleCommentDeleteClick = null;
  #handleAddCommentKeydown = null;

  constructor({ film, onCloseBtnClick, onWatchlistClick, onAlreadyWatchedClick, onFavoriteClick, onCommentDelete, onCommentAdd }) {
    super();

    this._setState(FilmPopupView.parseFilmToState(film));

    this.#handleCloseBtnClick = onCloseBtnClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleCommentDeleteClick = onCommentDelete;
    this.#handleAddCommentKeydown = onCommentAdd;
    this.defaultEmoji = DEFAULT_EMOJI;

    this._restoreHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._state);
  }

  reset(film) {
    this.#updateElement(
      FilmPopupView.parseFilmToState(film));
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeBtnClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#commentSubmitClickHandler);
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#commentDeleteClickHandler);
  }

  #updateElement(update) {
    this.updateElement({
      ...update,
      scrollPosition: this.element.scrollTop
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  }

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseBtnClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #emojiChangeHandler = (evt) => {
    this.#updateElement({
      commentEmoji: evt.target.value,
    });
  };

  #commentSubmitClickHandler = (evt) => {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      const addedComment = {
        comment: he.encode(evt.target.value),
        emotion: this._state.commentEmoji
      };
      this.#handleAddCommentKeydown(this._state.id, addedComment);
    }
  };

  #commentDeleteClickHandler = (evt) => {
    if (evt.target.classList.contains('film-details__comment-delete')) {
      const deletedComment = this._state.comments.find((comment)=> comment.id === evt.target.dataset.id);
      this._state.comments = this._state.comments.filter((comment) => comment.id !== evt.target.dataset.id);

      this.#handleCommentDeleteClick({
        ...FilmPopupView.parseStateToFilm(this._state), deletedComment
      });
    }
  };

  static parseFilmToState(film) {
    return {
      ...film,
      commentEmoji: DEFAULT_EMOJI
    };
  }

  static parseStateToFilm(state) {
    const film = {
      ...state,
      comments: state.comments.map((comment) => comment.id)
    };

    delete film.scrollPosition;
    delete film.commentEmoji;

    return film;
  }
}
