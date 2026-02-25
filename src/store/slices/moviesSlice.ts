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
  movieDetails: Movie | null;
  movieDetailsLoading: boolean;
  movieDetailsError: string | null;
  movieDetailsById: Record<number, Movie>;
}

const initialState: MoviesState = {
  popular: [],
  nowPlaying: [],
  searchResults: [],
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  movieDetails: null,
  movieDetailsLoading: false,
  movieDetailsError: null,
  movieDetailsById: {},
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
  FETCH_MOVIE_DETAILS_REQUEST: 'movies/fetchMovieDetailsRequest',
  FETCH_MOVIE_DETAILS_SUCCESS: 'movies/fetchMovieDetailsSuccess',
  FETCH_MOVIE_DETAILS_FAILURE: 'movies/fetchMovieDetailsFailure',
  CACHE_MOVIE_DETAILS: 'movies/cacheMovieDetails',
} as const;

export const fetchPopularRequest = (page?: number) => ({ type: MOVIES_ACTIONS.FETCH_POPULAR_REQUEST, payload: page });

export const fetchPopularSuccess = (data: { results: Movie[]; page: number; total_pages: number }) =>
  ({ type: MOVIES_ACTIONS.FETCH_POPULAR_SUCCESS, payload: data });

export const fetchPopularFailure = (error: string) => ({ type: MOVIES_ACTIONS.FETCH_POPULAR_FAILURE, payload: error });

export const fetchNowPlayingRequest = (page?: number) =>
  ({ type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_REQUEST, payload: page });

export const fetchNowPlayingSuccess = (data: { results: Movie[]; page: number; total_pages: number }) =>
  ({ type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_SUCCESS, payload: data });

export const fetchNowPlayingFailure = (error: string) =>
  ({ type: MOVIES_ACTIONS.FETCH_NOW_PLAYING_FAILURE, payload: error });

export const searchInputChange = (query: string) => ({ type: MOVIES_ACTIONS.SEARCH_INPUT_CHANGE, payload: { query } });

export const searchRequest = (payload: { query: string; page?: number }) => ({ type: MOVIES_ACTIONS.SEARCH_REQUEST, payload });

export const searchClear = () => ({ type: MOVIES_ACTIONS.SEARCH_CLEAR });

export const fetchMovieDetailsRequest = (movieId: number) =>
  ({ type: MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_REQUEST, payload: movieId });

export const fetchMovieDetailsSuccess = (movie: Movie) =>
  ({ type: MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_SUCCESS, payload: movie });

export const fetchMovieDetailsFailure = (error: string) =>
  ({ type: MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_FAILURE, payload: error });

export const cacheMovieDetails = (movie: Movie) => ({ type: MOVIES_ACTIONS.CACHE_MOVIE_DETAILS, payload: movie });

export const searchSuccess = (data: { results: Movie[]; page: number; total_pages: number }) =>
  ({ type: MOVIES_ACTIONS.SEARCH_SUCCESS, payload: data });

export const searchFailure = (error: string) => ({ type: MOVIES_ACTIONS.SEARCH_FAILURE, payload: error });

export const moviesReducer = (state = initialState, action: { type: string; payload?: unknown }): MoviesState => {
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
      const trimmed = query.trim();
      return {
        ...state,
        searchQuery: query,
        ...(trimmed.length < 2 && {
          searchResults: [],
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
        }),
      };
    }

    case MOVIES_ACTIONS.SEARCH_CLEAR:
      return { ...state, searchResults: [], searchQuery: '', currentPage: 1, totalPages: 1, isLoading: false };

    case MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_REQUEST:
      return { ...state, movieDetailsLoading: true, movieDetailsError: null };

    case MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_SUCCESS: {
      const movie = action.payload as Movie;
      return {
        ...state,
        movieDetails: movie,
        movieDetailsLoading: false,
        movieDetailsError: null,
        movieDetailsById: { ...state.movieDetailsById, [movie.id]: movie },
      };
    }

    case MOVIES_ACTIONS.CACHE_MOVIE_DETAILS: {
      const movie = action.payload as Movie;
      return {
        ...state,
        movieDetailsById: { ...state.movieDetailsById, [movie.id]: movie },
      };
    }

    case MOVIES_ACTIONS.FETCH_MOVIE_DETAILS_FAILURE:
      return {
        ...state,
        movieDetailsLoading: false,
        movieDetailsError: (action.payload as string) || 'Failed to load',
      };

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
};
