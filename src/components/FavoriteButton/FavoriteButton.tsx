import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export const FavoriteButton = ({ isFavorite, onToggle }: FavoriteButtonProps) => {
  const { ref, focused } = useFocusable({
    focusKey: 'favorite-button',
    onEnterPress: onToggle,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''} ${focused ? styles.focused : ''}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      tabIndex={-1}
    >
      {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    </button>
  );
};
