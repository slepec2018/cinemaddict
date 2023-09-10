import AbstractView from '../framework/view/abstract-view';


const createFilmListTemplate = () => '<section class="films-list"></section>';

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }
}
