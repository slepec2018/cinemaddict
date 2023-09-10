import FilmsModel from './model/films-model';
import ContentPresenter from './presenter/content-presenter';
import CommentsModel from './model/comments-model.js';
import FilmsApiService from './api/films-api-service.js';
import CommentsApiService from './api/comments-api-service.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic mhkjhkj787878';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});

const commentsModel = new CommentsModel({
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION),
  filmsModel
});

const filterModel = new FilterModel();

const contentPresenter = new ContentPresenter({
  filmContainer: siteMainElement,
  filmsModel,
  commentsModel,
  filterModel,
});

contentPresenter.init();
filmsModel.init();
