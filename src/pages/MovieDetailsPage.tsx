import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../services/tmdbApi';
import getPosterUrl from '../utils/imageUrl';
import type { Movie } from '../store/slices/moviesSlice';
import { KeyCode } from '../constants/keyCode';
import styles from './MovieDetailsPage.module.scss';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    fetchMovieDetails(movieId)
      .then((data) => setMovie(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KeyCode.Tab) {
        e.preventDefault();
        return;
      }
      if (e.key === KeyCode.Escape) {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (error || !movie) return <div className={styles.page}>{error || 'Movie not found'}</div>;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <img
          className={styles.poster}
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
        />
        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>
          <span className={styles.year}>{year}</span>
          <p className={styles.overview}>{movie.overview}</p>
          <p className={styles.rating}>★ {movie.vote_average.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
