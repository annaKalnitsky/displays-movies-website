import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '../../../components/MovieCard/MovieCard';
import { Spinner } from '../../../components/Spinner/Spinner';
import { Pagination } from '../../../components/Pagination/Pagination';
import { fetchNowPlayingRequest, fetchPopularRequest } from '../../../store/slices/moviesSlice';
import type { Movie } from '../../../store/slices/moviesSlice';
import { Category } from '../../../constants/category';
import styles from '../HomePage.module.scss';

interface HomeContentProps {
  content: {
    isLoading: boolean;
    movies: Movie[];
    emptyText: string;
  };
  pagination: {
    enabled: boolean;
    currentPage: number;
    totalPages: number;
    resetKey: string;
    activeCategory: Category;
  };
}

export const HomeContent = ({
  content: { isLoading, movies, emptyText },
  pagination: { enabled, currentPage, totalPages, resetKey, activeCategory },
}: HomeContentProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openMovie = (movieId: number) => navigate(`/movie/${movieId}`);
  const handlePageSelect = (page: number) => {
    if (activeCategory === Category.Popular) dispatch(fetchPopularRequest(page));
    else if (activeCategory === Category.AiringNow) dispatch(fetchNowPlayingRequest(page));
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className={styles.loading}>
        <Spinner size={48} />
      </div>
    );
  }

  if (movies.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
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
      {enabled && totalPages > 1 && (
        <Pagination
          key={resetKey}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSelect={handlePageSelect}
        />
      )}
    </>
  );
};

