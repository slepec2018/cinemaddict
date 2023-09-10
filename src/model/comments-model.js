import Observable from '../framework/observable.js';
import { adaptFilmsToClient } from '../utils/common';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #filmsModel = null;

  constructor({commentsApiService, filmsModel}) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#filmsModel = filmsModel;
  }

  async getFilmComments(filmId) {
    return await this.#commentsApiService.getFilmComments(filmId);
  }

  async addComment(updateType, update) {
    try {
      const response = await this.#commentsApiService.addComment(update.filmId, update.addedComment);
      const updatedFilm = adaptFilmsToClient(response.movie);
      this.#filmsModel.updateFilmOnClient(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update) {
    try {
      await this.#commentsApiService.deleteComment(update.deletedComment.id);
      delete update.deletedComment;
      this.#filmsModel.updateFilmOnClient(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

}
