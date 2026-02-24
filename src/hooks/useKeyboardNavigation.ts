import { useEffect, useCallback } from 'react';
import { KeyCode } from '../constants/keyCode';

const GRID_COLS = 4;

interface UseKeyboardNavigationOptions {
  itemCount: number;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
  onSelect: (index: number) => void;
  onEscape?: () => void;
  enabled?: boolean;
}

const useKeyboardNavigation = ({
  itemCount,
  focusedIndex,
  onFocusChange,
  onSelect,
  onEscape,
  enabled = true,
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if (e.key === KeyCode.Tab) {
        e.preventDefault();
        return;
      }

      if (e.key === KeyCode.Escape) {
        e.preventDefault();
        onEscape?.();
        return;
      }

      if (e.key === KeyCode.Enter) {
        e.preventDefault();
        if (itemCount > 0 && focusedIndex >= 0 && focusedIndex < itemCount) {
          onSelect(focusedIndex);
        }
        return;
      }

      if (itemCount === 0) return;

      let nextIndex = focusedIndex;

      if (e.key === KeyCode.ArrowRight) {
        e.preventDefault();
        nextIndex = Math.min(focusedIndex + 1, itemCount - 1);
      } else if (e.key === KeyCode.ArrowLeft) {
        e.preventDefault();
        nextIndex = Math.max(focusedIndex - 1, 0);
      } else if (e.key === KeyCode.ArrowDown) {
        e.preventDefault();
        nextIndex = Math.min(focusedIndex + GRID_COLS, itemCount - 1);
      } else if (e.key === KeyCode.ArrowUp) {
        e.preventDefault();
        nextIndex = Math.max(focusedIndex - GRID_COLS, 0);
      }

      if (nextIndex !== focusedIndex) {
        onFocusChange(nextIndex);
      }
    },
    [enabled, itemCount, focusedIndex, onFocusChange, onSelect, onEscape]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardNavigation;
