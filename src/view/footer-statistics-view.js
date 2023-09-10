import AbstractView from '../framework/view/abstract-view';


const createFooterStatisticsTemplate = (filmsCount) => `
<section class="footer__statistics">
  <p>${filmsCount} movies inside</p>
</section>
`;

export default class FooterStatisticsView extends AbstractView {
  #filmsCount = null;

  constructor ({filmsCount}) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsCount);
  }
}
