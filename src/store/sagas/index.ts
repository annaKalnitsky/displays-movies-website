import { all } from 'redux-saga/effects';
import { moviesSaga } from './moviesSaga';

export function* rootSaga() {
  yield all([moviesSaga()]);
}
