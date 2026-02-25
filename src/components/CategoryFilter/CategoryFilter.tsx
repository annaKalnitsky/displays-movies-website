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
          onSelect={onSelect}
        />
      ))}
      <SearchBar />
    </nav>
  );
};

export default CategoryFilter;
