import FilmPopupView from '../view/film-popup-view';


let popupIsRendered = null;

export default class FilmPopupPresenter {
  #popupContainer = null;
  filmPopupComponent = null;
  #film = null;
  #commentsModel = null;
  #handleWatchlistClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;
  #handleCommentDelete = null;
  #handleCommentAdd = null;


  constructor ({ popupContainer, film, commentsModel, handleWatchlistClick, handleAlreadyWatchedClick, handleFavoriteClick, handleCommentAdd, handleCommentDelete}){
    this.#film = film;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
    this.#handleWatchlistClick = handleWatchlistClick;
    this.#handleAlreadyWatchedClick = handleAlreadyWatchedClick;
    this.#handleFavoriteClick = handleFavoriteClick;
    this.#handleCommentDelete = handleCommentDelete;
    this.#handleCommentAdd = handleCommentAdd;
  }

  renderPopup() {
    this.#commentsModel.getFilmComments(this.#film.id).then((comments) => {
      if (popupIsRendered) {
        popupIsRendered.deletePopup();
      }
      this.filmPopupComponent = new FilmPopupView({
        film: {...this.#film, comments},
        onCloseBtnClick: this.#deletePopupClickHandler,
        onWatchlistClick: this.#handleWatchlistClick,
        onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
        onFavoriteClick: this.#handleFavoriteClick,
        onCommentDelete: this.#handleCommentDelete,
        onCommentAdd: this.#handleCommentAdd,
      });
      document.body.classList.add('hide-overflow');
      this.#popupContainer.appendChild(this.filmPopupComponent.element);
      this.#popupContainer.addEventListener('keydown', this.#deletePopupKeydownHandler);
      popupIsRendered = this;
    });
  }

  deletePopup() {
    document.body.classList.remove('hide-overflow');
    this.#popupContainer.removeChild(this.filmPopupComponent.element);
    this.#popupContainer.removeEventListener('keydown', this.#deletePopupKeydownHandler);
    popupIsRendered = null;
  }

  getRenderedPopup() {
    return popupIsRendered;
  }

  resetPopupComponent(popupComponent, film) {
    this.#commentsModel.getFilmComments(this.#film.id).then((comments)=> {
      popupComponent.reset({...film, comments});
    });
  }

  #deletePopupClickHandler = () => {
    this.deletePopup();
  };

  #deletePopupKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.deletePopup();
    }
  };
}
