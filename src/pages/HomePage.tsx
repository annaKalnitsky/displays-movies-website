import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MovieCard } from '../components/MovieCard/MovieCard';
import { fetchPopularRequest } from '../store/slices/moviesSlice';
import type { RootState } from '../store';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { popular, isLoading, error } = useSelector((state: RootState) => state.movies);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    dispatch(fetchPopularRequest(1));
  }, [dispatch]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, popular.length);
    setFocusedIndex(0);
  }, [popular.length]);

  useEffect(() => {
    const el = cardRefs.current[focusedIndex];
    el?.focus();
  }, [focusedIndex]);

  useKeyboardNavigation({
    itemCount: popular.length,
    focusedIndex,
    onFocusChange: setFocusedIndex,
    onSelect: (index) => {
      const movie = popular[index];
      if (movie) navigate(`/movie/${movie.id}`);
    },
    enabled: !isLoading && popular.length > 0,
  });

  if (error) {
    return (
      <div className={styles.homePage}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Popular Movies</h1>
      </header>

      {isLoading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.movieGrid}>
          {popular.map((movie, index) => (
            <MovieCard
              key={movie.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              movie={movie}
              isFocused={focusedIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
