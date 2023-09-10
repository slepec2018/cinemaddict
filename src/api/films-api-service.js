import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class FilmsApiService extends ApiService {

  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(film) {

    const release = {...film.filmInfo.release,
      'release_country': film.filmInfo.release.releaseCountry,
      'date': film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null
    };

    delete release.releaseCountry;

    const filmInfo = {...film.filmInfo,
      'age_rating': film.filmInfo.ageRating,
      'total_rating': film.filmInfo.totalRating,
      'alternative_title': film.filmInfo.alternativeTitle,
      release,
    };

    delete filmInfo.ageRating;
    delete filmInfo.totalRating;
    delete filmInfo.alternativeTitle;

    const userDetails = {...film.userDetails,
      'already_watched': film.userDetails.alreadyWatched,
      'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null

    };
    delete userDetails.alreadyWatched;
    delete userDetails.watchingDate;

    const adaptedToServer = {...film,
      'user_details': userDetails,
      'film_info': filmInfo
    };

    delete adaptedToServer.userDetails;
    delete adaptedToServer.filmInfo;

    return adaptedToServer;
  }
}
