import { TMDB_IMAGE_BASE_URL } from '../constants/api';

const getPosterUrl = (path: string | null): string => {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export default getPosterUrl;
