import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Category } from '../../constants/category';
import styles from './CategoryFilter.module.scss';

interface FilterTabProps {
  category: Category;
  label: string;
  isActive: boolean;
  onSelect: (category: Category) => void;
}

export const FilterTab = ({ category, label, isActive, onSelect }: FilterTabProps) => {
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
