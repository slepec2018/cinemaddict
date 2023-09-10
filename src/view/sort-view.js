import { SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';


const createSortTemplate = (currentSortType) => `
<ul class="sort">
${Object.values(SortType).map((sortType) => `
<li>
  <a href="#" class="sort__button ${currentSortType === sortType ? 'sort__button--active' : ''}" data-sort-type="${sortType}">
    Sort by ${sortType}
  </a>
</li>
`).join('')}
</ul>`;

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({onSortTypeChange, currentSortType}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('sort__button') && !evt.target.classList.contains('sort__button--active')) {
      this.#handleSortTypeChange(evt.target, evt.target.dataset.sortType);
    }
  };
}
