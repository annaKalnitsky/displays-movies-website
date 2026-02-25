import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { fetchPopularRequest, fetchNowPlayingRequest, searchClear } from '../../store/slices/moviesSlice';
import type { RootState } from '../../store';
import { Category } from '../../constants/category';
import { HomeHeader } from './components/HomeHeader';
import { HomeContent } from './components/HomeContent';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const dispatch = useDispatch();
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
  }, [focusSelf]);

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

  const emptyText = hasSearchQuery ? 'No results found' : 'No movies to show';
  const handleSelectCategory = (category: Category) => {
    dispatch(searchClear());
    setActiveCategory(category);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={styles.homePage}>
        <HomeHeader
          title={categoryTitle}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        <HomeContent
          content={{
            isLoading,
            movies,
            emptyText,
          }}
          pagination={{
            enabled: isPaginatedCategory,
            currentPage,
            totalPages,
            resetKey: activeCategory,
            activeCategory,
          }}
        />
      </div>
    </FocusContext.Provider>
  );
};

export default HomePage;

