import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { searchInputChange, searchClear } from '../../store/slices/moviesSlice';
import type { RootState } from '../../store';
import { useInputSpatialNav } from '../../hooks/useInputSpatialNav.ts';
import styles from './SearchBar.module.scss';

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  const { ref, focused } = useFocusable({
    focusKey: 'search-clear',
    onEnterPress: onClear,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.clearBtn} ${focused ? styles.focused : ''}`}
      onClick={onClear}
      aria-label="Clear search"
      tabIndex={-1}
    >
      ×
    </button>
  );
};

export const SearchBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.movies.searchQuery);

  const getFocusTarget = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (direction === 'right' && searchQuery) return 'search-clear';
      return 'filter-favorites';
    },
    [searchQuery]
  );
  const { onKeyDownCapture } = useInputSpatialNav(getFocusTarget);

  const { ref: inputRef, focused: inputFocused } = useFocusable({
    focusKey: 'search-input',
    onEnterPress: () => {},
    onArrowPress: () => true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchInputChange(e.target.value));
  };

  const handleClear = () => {
    dispatch(searchClear());
    setFocus('search-input');
  };

  return (
    <div className={styles.searchRow} onKeyDownCapture={onKeyDownCapture}>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search movies..."
        className={`${styles.searchInput} ${inputFocused ? styles.focused : ''}`}
        tabIndex={-1}
        aria-label="Search movies"
      />
      {searchQuery && <ClearButton onClear={handleClear} />}
    </div>
  );
};

