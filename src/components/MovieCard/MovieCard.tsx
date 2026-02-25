import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import type { Movie } from '../../store/slices/moviesSlice';
import getPosterUrl from '../../utils/imageUrl';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const { ref, focused } = useFocusable({
    focusKey: `movie-${movie.id}`,
    onEnterPress: () => onSelect?.(movie),
  });

  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  const handleSelect = () => onSelect?.(movie);

  return (
    <article
      ref={ref}
      className={`${styles.movieCard} ${focused ? styles.focused : ''}`}
      tabIndex={-1}
      onClick={handleSelect}
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
};
