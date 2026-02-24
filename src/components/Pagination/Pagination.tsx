import { PageButton } from './PageButton';
import { ArrowButton } from './ArrowButton';
import usePaginationWindow from './usePaginationWindow';
import { WINDOW_SIZE } from './constants';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageSelect }: PaginationProps) => {
  const {
    hookPage,
    windowStart,
    hasPrevWindow,
    hasNextWindow,
    pageNumbers,
    setPage,
  } = usePaginationWindow(currentPage, totalPages);

  const handlePageSelect = (page: number) => {
    setPage(page - 1);
    onPageSelect(page);
  };

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {hasPrevWindow && (
        <ArrowButton
          icon="←"
          label="Previous pages"
          onClick={() => handlePageSelect(windowStart - WINDOW_SIZE)}
          focusKey="pagination-prev"
        />
      )}
      {pageNumbers.map((page) => (
        <PageButton
          key={page}
          page={page}
          isActive={page === hookPage + 1}
          onClick={() => handlePageSelect(page)}
          focusKey={`pagination-page-${page}`}
        />
      ))}
      {hasNextWindow && (
        <ArrowButton
          icon="→"
          label="Next pages"
          onClick={() => handlePageSelect(windowStart + WINDOW_SIZE)}
          focusKey="pagination-next"
        />
      )}
    </nav>
  );
};
