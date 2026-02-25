import { call, put, takeLatest, debounce, delay } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import {
  MOVIES_ACTIONS,
  fetchPopularSuccess,
  fetchPopularFailure,
  fetchNowPlayingSuccess,
  fetchNowPlayingFailure,
  searchRequest,
  searchSuccess,
  searchFailure,
  fetchMovieDetailsSuccess,
  fetchMovieDetailsFailure,
} from '../slices/moviesSlice';
import { fetchPopularMovies, fetchNowPlayingMovies, searchMovies, fetchMovieDetails } from '../../services/tmdbApi';

const DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 2;
const SEARCH_MIN_INTERVAL_MS = 2000; // 5 requests per 10 seconds

let lastSearchTime = 0;

function* fetchPopularSaga(action: { type: string; payload?: number }): SagaIterator {
  try {
    const page = action.payload ?? 1;
    const data = yield call(fetchPopularMovies, page);
    yield put(
      fetchPopularSuccess({
        results: data.results ?? [],
        page: data.page ?? 1,
        total_pages: data.total_pages ?? 1,
      })
    );
  } catch (error) {
    yield put(fetchPopularFailure(error instanceof Error ? error.message : 'Failed to fetch popular movies'));
  }
}

function* fetchNowPlayingSaga(action: { type: string; payload?: number }): SagaIterator {
  try {
    const page = action.payload ?? 1;
    const data = yield call(fetchNowPlayingMovies, page);
    yield put(
      fetchNowPlayingSuccess({
        results: data.results ?? [],
        page: data.page ?? 1,
        total_pages: data.total_pages ?? 1,
      })
    );
  } catch (error) {
    yield put(fetchNowPlayingFailure(error instanceof Error ? error.message : 'Failed to fetch now playing movies'));
  }
}

function* searchInputChangeSaga(action: { type: string; payload?: { query: string } }): SagaIterator {
  const query = (action.payload?.query ?? '').trim();
  if (query.length < MIN_SEARCH_LENGTH) return;

  yield put(searchRequest({ query }));

  const waitMs = SEARCH_MIN_INTERVAL_MS - (Date.now() - lastSearchTime);
  if (waitMs > 0) yield delay(waitMs);
  lastSearchTime = Date.now();

  try {
    const data = yield call(searchMovies, query, 1);
    yield put(
      searchSuccess({
        results: data.results ?? [],
        page: data.page ?? 1,
        total_pages: data.total_pages ?? 1,
      })
    );
  } catch (error) {
    yield put(searchFailure(error instanceof Error ? error.message : 'Search failed'));
  }
}

function* fetchMovieDetailsSaga(action: { type: string; payload?: number }): SagaIterator {
  const movieId = action.payload;
  if (movieId == null || isNaN(movieId)) {
    yield put(fetchMovieDetailsFailure('Invalid movie ID'));
    return;
  }

  try {
    const data = yield call(fetchMovieDetails, movieId);
    yield put(fetchMovieDetailsSuccess(data));
  } catch (error) {
    yield put(fetchMovieDetailsFailure(error instanceof Error ? error.message : 'Failed to load'));
  }
}

export function* moviesSaga() {
  yield takeLatest(MOVIES_ACTIONS.FETCH_POPULAR_REQUEST, fetchPopularSaga);
  yield takeLatest(MOVIES_ACTIONS.FETCH_NOW_PLAYING_REQUEST, fetchNowPlayingSaga);
  yield takeLatest(MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_REQUEST, fetchMovieDetailsSaga);
  yield debounce(DEBOUNCE_MS, MOVIES_ACTIONS.SEARCH_INPUT_CHANGE, searchInputChangeSaga);
}
