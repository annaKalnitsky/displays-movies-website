import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { MovieCard } from '../components/MovieCard/MovieCard';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import { Spinner } from '../components/Spinner/Spinner';
import { Pagination } from '../components/Pagination/Pagination';
import { fetchPopularRequest, fetchNowPlayingRequest, searchClear } from '../store/slices/moviesSlice';
import type { RootState } from '../store';
import { Category } from '../constants/category';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { popular, nowPlaying, searchResults, searchQuery, isLoading, error, currentPage, totalPages } = useSelector(
    (state: RootState) => state.movies
  );
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.Popular);

  const hasSearchQuery = Boolean(searchQuery?.trim());
  const isPaginatedCategory = activeCategory === Category.Popular || activeCategory === Category.AiringNow;

  const { ref, focusKey, focusSelf } = useFocusable({
    focusKey: 'home-page',
    focusable: false,
    trackChildren: true,
    preferredChildFocusKey: 'filter-row',
  });

  useEffect(() => {
    focusSelf();
  }, []);

  useEffect(() => {
    if (activeCategory === Category.Popular) {
      dispatch(fetchPopularRequest(1));
    } else if (activeCategory === Category.AiringNow) {
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

  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    const isPageChange = prevPageRef.current !== currentPage;
    prevPageRef.current = currentPage;
    if (isPageChange && isPaginatedCategory && movies.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const timer = setTimeout(() => setFocus(`movie-${movies[0].id}`), 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isPaginatedCategory, movies]);

  if (error) {
    return (
      <div className={styles.homePage}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  const categoryTitle = hasSearchQuery
    ? 'Search'
    : activeCategory === Category.Popular
      ? 'Popular'
      : activeCategory === Category.AiringNow
        ? 'Airing Now'
        : 'My Favorites';

  const handlePageSelect = (page: number) =>
    activeCategory === Category.Popular ? dispatch(fetchPopularRequest(page)) : dispatch(fetchNowPlayingRequest(page));

  const openMovie = (movieId: number) => navigate(`/movie/${movieId}`);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={styles.homePage}>
        <header className={styles.header}>
          <h1 className={styles.title}>{categoryTitle}</h1>
          <CategoryFilter
            activeCategory={activeCategory}
            onSelect={(category) => {
              dispatch(searchClear());
              setActiveCategory(category);
            }}
          />
        </header>

        {isLoading && movies.length === 0 ? (
          <div className={styles.loading}>
            <Spinner size={48} />
          </div>
        ) : movies.length === 0 ? (
          <p className={styles.empty}>No movies to show</p>
        ) : (
          <>
            <div className={styles.movieGrid}>
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={() => openMovie(movie.id)}
                />
              ))}
            </div>
            {isPaginatedCategory && totalPages > 1 && (
              <Pagination
                key={activeCategory}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageSelect={handlePageSelect}
              />
            )}
          </>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default HomePage;
