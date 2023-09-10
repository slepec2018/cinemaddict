import dayjs from 'dayjs';

const RELEASE_FORMAT = 'YYYY';
const POPUP_RELEASE_FORMAT = 'DD MMMM YYYY';
const POPUP_COMMENT_FORMAT = 'YYYY/MM/DD HH/mm';

export const humanizeReleazeDate = (date) => date ? dayjs(date)
  .format(RELEASE_FORMAT) : '';

export const humanizePopupReleaseDate = (date) => date ? dayjs(date)
  .format(POPUP_RELEASE_FORMAT) : '';

export const humanizePopupCommentDate = (date) => date ? dayjs(date)
  .format(POPUP_COMMENT_FORMAT) : '';

export const sortByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date)
  .diff(dayjs(filmA.filmInfo.release.date));

export const sortByRating = (filmA, filmB) => filmB.filmInfo
  .totalRating - filmA.filmInfo.totalRating;
