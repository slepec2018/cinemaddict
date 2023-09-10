import AbstractView from '../framework/view/abstract-view';


const createShowMoreBtnTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreBtnView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click',
      this.#clickHandler);
  }

  get template() {
    return createShowMoreBtnTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
