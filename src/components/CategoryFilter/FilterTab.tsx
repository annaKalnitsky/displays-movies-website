import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Category } from '../../constants/category';
import styles from './CategoryFilter.module.scss';

interface FilterTabProps {
  category: Category;
  label: string;
  isActive: boolean;
  onSelectNow: (category: Category) => void;
  onFocusDelayed: (category: Category) => void;
  onBlur: () => void;
}

export const FilterTab = ({ category, label, isActive, onSelectNow, onFocusDelayed, onBlur }: FilterTabProps) => {
  const { ref, focused } = useFocusable({
    focusKey: `filter-${category}`,
    onEnterPress: () => onSelectNow(category),
    onFocus: () => onFocusDelayed(category),
    onBlur,
  });

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${styles.tab} ${isActive ? styles.active : ''} ${focused ? styles.focused : ''}`}
      tabIndex={-1}
      onClick={() => onSelectNow(category)}
    >
      {label}
    </button>
  );
};
