import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class CommentsApiService extends ApiService {

  async getFilmComments(filmId) {
    return this._load({ url: `comments/${filmId}` })
      .then(ApiService.parseResponse);
  }

  async addComment(filmId, comment) {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteComment(commentId) {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  }
}
