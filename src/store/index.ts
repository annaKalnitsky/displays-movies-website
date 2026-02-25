import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { moviesReducer } from './slices/moviesSlice';
import { favoritesReducer, reloadFavoritesFromStorage, FAVORITES_STORAGE_KEY } from './slices/favoritesSlice';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

window.addEventListener('storage', (e) => {
  if (e.key === FAVORITES_STORAGE_KEY) store.dispatch(reloadFavoritesFromStorage());
});

export type RootState = ReturnType<typeof store.getState>;
