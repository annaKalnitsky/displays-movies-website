import { forwardRef } from 'react';
import type { Movie } from '../../store/slices/moviesSlice';
import getPosterUrl from '../../utils/imageUrl';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Movie;
  isFocused?: boolean;
}

export const MovieCard = forwardRef<HTMLElement, MovieCardProps>(function MovieCard(
  { movie, isFocused = false },
  ref
) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <article
      ref={ref}
      className={`${styles.movieCard} ${isFocused ? styles.focused : ''}`}
      tabIndex={-1}
    >
      <img
        className={styles.poster}
        src={posterUrl}
        alt={movie.title}
        loading="lazy"
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <span className={styles.year}>{year}</span>
        <span className={styles.rating}>★ {movie.vote_average.toFixed(1)}</span>
      </div>
    </article>
  );
});
