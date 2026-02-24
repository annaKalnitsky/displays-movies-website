import { TMDB_BASE_URL } from '../constants/api';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function buildUrl(path: string, params: Record<string, string | number> = {}): string {
  const searchParams = new URLSearchParams({
    api_key: API_KEY || '',
    language: 'en-US',
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });
  return `${TMDB_BASE_URL}${path}?${searchParams}`;
}

export async function fetchPopularMovies(page = 1) {
  const url = buildUrl('/movie/popular', { page });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchNowPlayingMovies(page = 1) {
  const url = buildUrl('/movie/now_playing', { page });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchMovieDetails(movieId: number) {
  const url = buildUrl(`/movie/${movieId}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function searchMovies(query: string, page = 1) {
  const url = buildUrl('/search/movie', { query, page });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
