import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import getPosterUrl from '../../utils/imageUrl';
import type { RootState } from '../../store';
import { fetchMovieDetailsRequest, fetchMovieDetailsFailure } from '../../store/slices/moviesSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { cacheMovieDetails } from '../../store/slices/moviesSlice';
import { FavoriteButton } from '../../components/FavoriteButton/FavoriteButton';
import { Spinner } from '../../components/Spinner/Spinner';
import { KeyCode } from '../../constants/keyCode';
import styles from './MovieDetailsPage.module.scss';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movieDetails, movieDetailsLoading, movieDetailsError } = useSelector((state: RootState) => state.movies);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const isFavorite = movieDetails ? favoriteIds.includes(movieDetails.id) : false;
  const loadedMovieId = movieDetails?.id;

  const toggleFavorite = () => {
    if (!movieDetails) return;
    if (isFavorite) {
      dispatch(removeFromFavorites(movieDetails.id));
    } else {
      dispatch(cacheMovieDetails(movieDetails));
      dispatch(addToFavorites(movieDetails.id));
    }
  };

  const isPopup = new URLSearchParams(window.location.search).get('popup') === '1';

  useEffect(() => {
    if (!id) return;
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      dispatch(fetchMovieDetailsFailure('Invalid movie ID'));
      return;
    }
    if (loadedMovieId === movieId) return;
    dispatch(fetchMovieDetailsRequest(movieId));
  }, [id, dispatch, loadedMovieId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KeyCode.Escape) {
        e.preventDefault();
        e.stopPropagation();
        if (isPopup) {
          window.close();
        } else {
          navigate(-1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isPopup, navigate]);

  const { ref: pageRef, focusKey, focusSelf } = useFocusable({
    focusKey: 'movie-details-page',
    focusable: false,
    trackChildren: true,
    preferredChildFocusKey: 'favorite-button',
  });

  useEffect(() => {
    if (movieDetails) focusSelf();
  }, [movieDetails, focusSelf]);

  if (movieDetailsLoading)
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Spinner size={48} />
        </div>
      </div>
    );
  if (movieDetailsError || !movieDetails)
    return (
      <div className={styles.page}>
        {movieDetailsError || 'Movie not found'}
      </div>
    );

  const year = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : '';

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={pageRef} className={styles.page}>
        <div className={styles.content}>
          <img
            className={styles.poster}
            src={getPosterUrl(movieDetails.poster_path)}
            alt={movieDetails.title}
          />
          <div className={styles.info}>
            <h1 className={styles.title}>{movieDetails.title}</h1>
            <span className={styles.year}>{year}</span>
            <FavoriteButton isFavorite={isFavorite} onToggle={toggleFavorite} />
            <p className={styles.overview}>{movieDetails.overview}</p>
            <p className={styles.rating}>★ {movieDetails.vote_average.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default MovieDetailsPage;

