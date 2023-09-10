import AbstractView from '../framework/view/abstract-view';


const createFilmBoardTemplate = () => '<section class="films"></section>';

export default class FilmsBoardView extends AbstractView {
  get template() {
    return createFilmBoardTemplate();
  }
}
