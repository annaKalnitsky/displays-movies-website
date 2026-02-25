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
    windowStart,
    hasPrevWindow,
    hasNextWindow,
    pageNumbers,
  } = usePaginationWindow(currentPage, totalPages);

  const handlePageSelect = (page: number) => onPageSelect(Math.min(Math.max(1, page), totalPages));

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
          isActive={page === currentPage}
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
