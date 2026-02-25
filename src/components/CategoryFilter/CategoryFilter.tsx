import { useCallback, useEffect, useRef } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Category } from '../../constants/category';
import { FilterTab } from './FilterTab';
import { SearchBar } from '../SearchBar/SearchBar';
import styles from './CategoryFilter.module.scss';

const TABS: { key: Category; label: string }[] = [
  { key: Category.Popular, label: 'Popular' },
  { key: Category.AiringNow, label: 'Airing Now' },
  { key: Category.Favorites, label: 'My Favorites' },
];

interface CategoryFilterProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

const CategoryFilter = ({ activeCategory, onSelect }: CategoryFilterProps) => {
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);
  useEffect(() => clearTimer(), [activeCategory, clearTimer]);

  const selectNow = useCallback(
    (category: Category) => {
      if (category === activeCategory) return;
      clearTimer();
      onSelect(category);
    },
    [activeCategory, clearTimer, onSelect]
  );

  const scheduleSelect = useCallback(
    (category: Category) => {
      if (category === activeCategory) return;
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        if (category === activeCategory) return;
        onSelect(category);
        timerRef.current = null;
      }, 2000);
    },
    [activeCategory, clearTimer, onSelect]
  );

  const { ref: navRef } = useFocusable({
    focusKey: 'filter-row',
    focusable: false,
    trackChildren: true,
  });

  return (
    <nav ref={navRef} className={styles.nav} role="tablist" aria-label="Filter by category">
      {TABS.map((tab) => (
        <FilterTab
          key={tab.key}
          category={tab.key}
          label={tab.label}
          isActive={activeCategory === tab.key}
          onSelectNow={selectNow}
          onFocusDelayed={scheduleSelect}
          onBlur={clearTimer}
        />
      ))}
      <SearchBar />
    </nav>
  );
};

export default CategoryFilter;
