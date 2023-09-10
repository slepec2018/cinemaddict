import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';


const createFilterItemsTemplate = (filter, currentFilter) => {
  const {type, name, filteredFilms} = filter;
  return (
    `<a href="#${type}" data-filter-type="${type}"
    class="main-navigation__item" ${type === currentFilter ? 'main-navigation__item--active' : ''}" >
    ${name} 
    <span class="main-navigation__item-count">${filteredFilms.length}
     </span>
     </a>`
  );
};

const createFiltersTemplate = (filters, currentFilterType) => (
  `<nav class="main-navigation">
      <a href="#all" data-filter-type="${FilterType.ALL}"
      class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}">
        All movies
      </a>
      ${Object.keys(filters).slice(1).map((filter) => `
        ${createFilterItemsTemplate(filters[filter], currentFilterType)}
      `).join('')}
   </nav>`
);

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({filters, currentFilter, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    const filter = evt.target.closest('.main-navigation__item');
    if (filter && !filter.classList.contains('main-navigation__item--active')) {
      this.#handleFilterChange(filter.dataset.filterType);
    }
  };
}
