import { call, put, takeLatest, debounce } from 'redux-saga/effects';
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
} from '../slices/moviesSlice';
import { fetchPopularMovies, fetchNowPlayingMovies, searchMovies } from '../../services/tmdbApi';

const DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 2;

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

export function* moviesSaga() {
  yield takeLatest(MOVIES_ACTIONS.FETCH_POPULAR_REQUEST, fetchPopularSaga);
  yield takeLatest(MOVIES_ACTIONS.FETCH_NOW_PLAYING_REQUEST, fetchNowPlayingSaga);
  yield debounce(DEBOUNCE_MS, MOVIES_ACTIONS.SEARCH_INPUT_CHANGE, searchInputChangeSaga);
}
