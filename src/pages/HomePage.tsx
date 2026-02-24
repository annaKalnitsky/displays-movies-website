import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { MovieCard } from '../components/MovieCard/MovieCard';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import { fetchPopularRequest, fetchNowPlayingRequest } from '../store/slices/moviesSlice';
import type { RootState } from '../store';
import { Category } from '../constants/category';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { popular, nowPlaying, searchResults, searchQuery, isLoading, error } = useSelector(
    (state: RootState) => state.movies
  );
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.Popular);

  const hasSearchQuery = Boolean(searchQuery?.trim());

  const { ref, focusKey } = useFocusable({
    focusKey: 'home-page',
    focusable: false,
    trackChildren: true,
  });

  useEffect(() => {
    dispatch(fetchPopularRequest(1));
  }, [dispatch]);

  useEffect(() => {
    if (activeCategory === Category.AiringNow) {
      dispatch(fetchNowPlayingRequest(1));
    }
  }, [activeCategory, dispatch]);

  const movies = hasSearchQuery
    ? searchResults
    : activeCategory === Category.Popular
      ? popular
      : activeCategory === Category.AiringNow
        ? nowPlaying
        : favorites;

  useEffect(() => {
    const timer = setTimeout(() => setFocus('filter-popular'), 100);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className={styles.homePage}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  const categoryTitle = hasSearchQuery
    ? `Search: ${searchQuery}`
    : activeCategory === Category.Popular
      ? 'Popular'
      : activeCategory === Category.AiringNow
        ? 'Airing Now'
        : 'My Favorites';

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={styles.homePage}>
        <header className={styles.header}>
          <h1 className={styles.title}>{categoryTitle}</h1>
          <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
        </header>

        {isLoading && movies.length === 0 ? (
          <p className={styles.loading}>Loading...</p>
        ) : movies.length === 0 ? (
          <p className={styles.empty}>No movies to show</p>
        ) : (
          <div className={styles.movieGrid}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={(m) => navigate(`/movie/${m.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default HomePage;
