import AbstractView from '../framework/view/abstract-view';


const createFilmListContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmListContainerView extends AbstractView {

  get template() {
    return createFilmListContainerTemplate();
  }
}
