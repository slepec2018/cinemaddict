import AbstractView from '../framework/view/abstract-view.js';

const getUserProfile = (watchedFilmsCount) => {
  if (watchedFilmsCount > 0 && watchedFilmsCount <= 10) {
    return 'novice';
  }
  if (watchedFilmsCount > 10 && watchedFilmsCount <= 20) {
    return 'fan';
  }
  if (watchedFilmsCount > 20) {
    return 'movie buff';
  }
};

const createProfileTemplate = (watchedFilmsQuantity) => (
  `<section class="header__profile profile">
      <p class="profile__rating">${getUserProfile(watchedFilmsQuantity)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
);

export default class UserProfileView extends AbstractView {
  #watchedFilmsQuantity = null;

  constructor({watchedFilmsCount}) {
    super();
    this.#watchedFilmsQuantity = watchedFilmsCount;
  }

  get template() {
    return createProfileTemplate(this.#watchedFilmsQuantity);
  }

}
