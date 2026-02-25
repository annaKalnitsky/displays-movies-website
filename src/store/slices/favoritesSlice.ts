export const FAVORITES_STORAGE_KEY = 'tmdb_favorites';
const STORAGE_KEY = FAVORITES_STORAGE_KEY;

function loadFromStorage(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => (typeof x === 'number' ? x : (x as { id: number }).id));
  } catch {
    return [];
  }
}

export interface FavoritesState {
  ids: number[];
}

const initialState: FavoritesState = {
  ids: loadFromStorage(),
};

export const FAVORITES_ACTIONS = {
  ADD: 'favorites/add',
  REMOVE: 'favorites/remove',
  RELOAD: 'favorites/reload',
} as const;

function saveToStorage(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export const addToFavorites = (movieId: number) => ({ type: FAVORITES_ACTIONS.ADD, payload: movieId });

export const removeFromFavorites = (movieId: number) => ({ type: FAVORITES_ACTIONS.REMOVE, payload: movieId });

export const reloadFavoritesFromStorage = () => ({ type: FAVORITES_ACTIONS.RELOAD });

export const favoritesReducer = (state = initialState, action: { type: string; payload?: unknown }): FavoritesState => {
  switch (action.type) {
    case FAVORITES_ACTIONS.ADD: {
      const movieId = action.payload as number;
      if (state.ids.includes(movieId)) return state;
      const ids = [...state.ids, movieId];
      saveToStorage(ids);
      return { ids };
    }

    case FAVORITES_ACTIONS.REMOVE: {
      const movieId = action.payload as number;
      const ids = state.ids.filter((id) => id !== movieId);
      if (ids.length === state.ids.length) return state;
      saveToStorage(ids);
      return { ids };
    }

    case FAVORITES_ACTIONS.RELOAD:
      return { ids: loadFromStorage() };

    default:
      return state;
  }
};
