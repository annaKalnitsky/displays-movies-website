import { useEffect } from 'react';
import { usePagination } from 'react-use-pagination';
import { PAGE_SIZE, WINDOW_SIZE } from './constants';

const getPageWindow = (currentPageIndex: number, totalPages: number) => {
  const windowIndex = Math.floor(currentPageIndex / WINDOW_SIZE);
  const windowStart = windowIndex * WINDOW_SIZE + 1;
  const windowEnd = Math.min(windowStart + WINDOW_SIZE - 1, totalPages);
  const pageNumbers = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i
  );

  return {
    windowStart,
    windowEnd,
    pageNumbers,
    hasPrevWindow: windowStart > 1,
    hasNextWindow: windowEnd < totalPages,
  };
};

const usePaginationWindow = (currentPage: number, totalPages: number) => {
  const totalItems = Math.max(totalPages * PAGE_SIZE, PAGE_SIZE);
  const pageIndex = Math.max(0, currentPage - 1);

  const { currentPage: hookPage, totalPages: hookTotalPages, setPage } = usePagination({
    totalItems,
    initialPage: pageIndex,
    initialPageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(Math.max(0, currentPage - 1));
  }, [currentPage, setPage]);

  const window = getPageWindow(hookPage, hookTotalPages);

  return {
    hookPage,
    ...window,
    setPage,
  };
};

export default usePaginationWindow;
