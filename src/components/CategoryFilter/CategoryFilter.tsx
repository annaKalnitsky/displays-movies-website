import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Category } from '../../constants/category';
import styles from './CategoryFilter.module.scss';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

const TABS: { key: Category; label: string }[] = [
  { key: Category.Popular, label: 'Popular' },
  { key: Category.AiringNow, label: 'Airing Now' },
  { key: Category.Favorites, label: 'My Favorites' },
];

interface FocusableTabProps {
  category: Category;
  label: string;
  isActive: boolean;
  onSelect: (category: Category) => void;
}

const FocusableTab = ({ category, label, isActive, onSelect }: FocusableTabProps) => {
  const { ref, focused } = useFocusable({
    focusKey: `filter-${category}`,
    onEnterPress: () => onSelect(category),
  });

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${styles.tab} ${isActive ? styles.active : ''} ${focused ? styles.focused : ''}`}
      onClick={() => onSelect(category)}
      tabIndex={-1}
    >
      {label}
    </button>
  );
};

const CategoryFilter = ({ activeCategory, onSelect }: CategoryFilterProps) => {
  return (
    <nav className={styles.nav} role="tablist" aria-label="Filter by category">
      {TABS.map((tab) => (
        <FocusableTab
          key={tab.key}
          category={tab.key}
          label={tab.label}
          isActive={activeCategory === tab.key}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
};

export default CategoryFilter;
