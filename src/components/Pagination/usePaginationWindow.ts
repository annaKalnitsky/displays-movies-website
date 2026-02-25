import { WINDOW_SIZE } from './constants';

const getPageWindow = (currentPage: number, totalPages: number) => {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const windowIndex = Math.floor((safeCurrentPage - 1) / WINDOW_SIZE);
  const windowStart = windowIndex * WINDOW_SIZE + 1;
  const windowEnd = Math.min(windowStart + WINDOW_SIZE - 1, safeTotalPages);
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
  return getPageWindow(currentPage, totalPages);
};

export default usePaginationWindow;
