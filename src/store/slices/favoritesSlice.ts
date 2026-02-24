import type { Movie } from './moviesSlice';

const STORAGE_KEY = 'tmdb_favorites';

function loadFromStorage(): Movie[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export interface FavoritesState {
  items: Movie[];
};

const initialState: FavoritesState = {
  items: loadFromStorage(),
};

export const FAVORITES_ACTIONS = {
  ADD: 'favorites/add',
  REMOVE: 'favorites/remove',
} as const;

function saveToStorage(items: Movie[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function addToFavorites(movie: Movie) {
  return { type: FAVORITES_ACTIONS.ADD, payload: movie };
}

export function removeFromFavorites(movieId: number) {
  return { type: FAVORITES_ACTIONS.REMOVE, payload: movieId };
}

export function favoritesReducer(state = initialState, action: { type: string; payload?: unknown }): FavoritesState {
  switch (action.type) {
    case FAVORITES_ACTIONS.ADD: {
      const movie = action.payload as Movie;
      if (state.items.some((m) => m.id === movie.id)) return state;
      const items = [...state.items, movie];
      saveToStorage(items);
      return { items };
    }

    case FAVORITES_ACTIONS.REMOVE: {
      const movieId = action.payload as number;
      const items = state.items.filter((m) => m.id !== movieId);
      if (items.length === state.items.length) return state;
      saveToStorage(items);
      return { items };
    }

    default:
      return state;
  }
}
