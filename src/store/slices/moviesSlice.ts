export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MoviesState {
  popular: Movie[];
  nowPlaying: Movie[];
  searchResults: Movie[];
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: MoviesState = {
  popular: [],
  nowPlaying: [],
  searchResults: [],
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const MOVIES_ACTIONS = {
  FETCH_POPULAR_REQUEST: 'movies/fetchPopularRequest',
  FETCH_POPULAR_SUCCESS: 'movies/fetchPopularSuccess',
  FETCH_POPULAR_FAILURE: 'movies/fetchPopularFailure',
  FETCH_NOW_PLAYING_REQUEST: 'movies/fetchNowPlayingRequest',
  FETCH_NOW_PLAYING_SUCCESS: 'movies/fetchNowPlayingSuccess',
  FETCH_NOW_PLAYING_FAILURE: 'movies/fetchNowPlayingFailure',
  SEARCH_INPUT_CHANGE: 'movies/searchInputChange',
  SEARCH_REQUEST: 'movies/searchRequest',
  SEARCH_SUCCESS: 'movies/searchSuccess',
  SEARCH_FAILURE: 'movies/searchFailure',
  SEARCH_CLEAR: 'movies/searchClear',
} as const;

export function fetchPopularRequest(page?: number) {
  return { type: MOVIES_ACTIONS.FETCH_POPULAR_REQUEST, payload: page };
}

export function fetchPopularSuccess(data: { results: Movie[]; page: number; total_pages: number }) {
  return { type: MOVIES_ACTIONS.FETCH_POPULAR_SUCCESS, payload: data };
}

export function fetchPopularFailure(error: string) {
  return { type: MOVIES_ACTIONS.FETCH_POPULAR_FAILURE, payload: error };
}

export function fetchNowPlayingRequest(page?: number) {
  return { type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_REQUEST, payload: page };
}

export function fetchNowPlayingSuccess(data: { results: Movie[]; page: number; total_pages: number }) {
  return { type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_SUCCESS, payload: data };
}

export function fetchNowPlayingFailure(error: string) {
  return { type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_FAILURE, payload: error };
}

export function searchInputChange(query: string) {
  return { type: MOVIES_ACTIONS.SEARCH_INPUT_CHANGE, payload: { query } };
}

export function searchRequest(payload: { query: string; page?: number }) {
  return { type: MOVIES_ACTIONS.SEARCH_REQUEST, payload };
}

export function searchClear() {
  return { type: MOVIES_ACTIONS.SEARCH_CLEAR };
}

export function searchSuccess(data: { results: Movie[]; page: number; total_pages: number }) {
  return { type: MOVIES_ACTIONS.SEARCH_SUCCESS, payload: data };
}

export function searchFailure(error: string) {
  return { type: MOVIES_ACTIONS.SEARCH_FAILURE, payload: error };
}

export function moviesReducer(state = initialState, action: { type: string; payload?: unknown }): MoviesState {
  switch (action.type) {
    case MOVIES_ACTIONS.FETCH_POPULAR_REQUEST:
    case MOVIES_ACTIONS.FETCH_NOW_PLAYING_REQUEST:
    case MOVIES_ACTIONS.SEARCH_REQUEST:
      return { ...state, isLoading: true, error: null };

    case MOVIES_ACTIONS.FETCH_POPULAR_SUCCESS: {
      const { results, page, total_pages } = action.payload as { results: Movie[]; page: number; total_pages: number };
      return {
        ...state,
        popular: results,
        currentPage: page,
        totalPages: total_pages,
        isLoading: false,
        error: null,
      };
    }

    case MOVIES_ACTIONS.FETCH_NOW_PLAYING_SUCCESS: {
      const { results, page, total_pages } = action.payload as { results: Movie[]; page: number; total_pages: number };
      return {
        ...state,
        nowPlaying: results,
        currentPage: page,
        totalPages: total_pages,
        isLoading: false,
        error: null,
      };
    }

    case MOVIES_ACTIONS.SEARCH_SUCCESS: {
      const { results, page, total_pages } = action.payload as { results: Movie[]; page: number; total_pages: number };
      return {
        ...state,
        searchResults: results ?? [],
        currentPage: page ?? 1,
        totalPages: total_pages ?? 1,
        isLoading: false,
        error: null,
      };
    }

    case MOVIES_ACTIONS.SEARCH_INPUT_CHANGE: {
      const query = (action.payload as { query: string })?.query ?? '';
      return {
        ...state,
        searchQuery: query,
        ...(query.trim().length === 0 && { searchResults: [] }),
      };
    }

    case MOVIES_ACTIONS.SEARCH_CLEAR:
      return { ...state, searchResults: [], searchQuery: '', isLoading: false };

    case MOVIES_ACTIONS.FETCH_POPULAR_FAILURE:
    case MOVIES_ACTIONS.FETCH_NOW_PLAYING_FAILURE:
    case MOVIES_ACTIONS.SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: (action.payload as string) || 'Unknown error',
      };

    default:
      return state;
  }
}
