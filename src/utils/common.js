import dayjs from 'dayjs';
import { remove, render, replace } from '../framework/render';

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export const humanizeDate = (date, format) => date ? dayjs(date).format(format) : '';

export const renderUpdateComponent = (container, component, prevComponent) => {
  if (prevComponent === null) {
    render(component, container);
    return;
  }

  if (container.contains(prevComponent.element)) {
    replace(component, prevComponent);
  }

  remove(prevComponent);
};

export const adaptFilmsToClient = (film) => {

  const release = {
    ...film.film_info.release,
    date: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
    releaseCountry: film.film_info.release.release_country
  };
  delete release.release_country;

  const filmInfo = {
    ...film.film_info,
    ageRating: film.film_info.age_rating,
    alternativeTitle: film.film_info.alternative_title,
    release,
    totalRating: film.film_info.total_rating,
  };
  delete filmInfo.age_rating;
  delete filmInfo.alternative_title;
  delete filmInfo.total_rating;

  const userDetails = {
    ...film.user_details,
    alreadyWatched: film.user_details.already_watched,
    watchingDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date
  };

  delete userDetails.already_watched;
  delete userDetails.watching_date;

  const adaptedMovie = {...film,
    filmInfo,
    userDetails,
  };

  delete adaptedMovie.user_details;
  delete adaptedMovie.film_info;

  return adaptedMovie;
};
