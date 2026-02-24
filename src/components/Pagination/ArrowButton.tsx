import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import styles from './Pagination.module.scss';

interface ArrowButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  focusKey: string;
}

export const ArrowButton = ({ icon, label, onClick, focusKey }: ArrowButtonProps) => {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onClick,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.button} ${styles.arrow} ${focused ? styles.focused : ''}`}
      onClick={onClick}
      aria-label={label}
      tabIndex={-1}
    >
      {icon}
    </button>
  );
};
