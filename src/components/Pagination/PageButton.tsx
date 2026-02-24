import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import styles from './Pagination.module.scss';

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
  focusKey: string;
}

export const PageButton = ({ page, isActive, onClick, focusKey }: PageButtonProps) => {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onClick,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.button} ${isActive ? styles.active : ''} ${focused ? styles.focused : ''}`}
      onClick={onClick}
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={-1}
    >
      {page}
    </button>
  );
};
