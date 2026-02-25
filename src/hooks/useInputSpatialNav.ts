import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { KeyCode } from '../constants/keyCode';

export type ArrowDirection = 'left' | 'right' | 'up' | 'down';

const ARROW_KEYS: readonly string[] = [
  KeyCode.ArrowLeft,
  KeyCode.ArrowRight,
  KeyCode.ArrowUp,
  KeyCode.ArrowDown,
];

const KEY_TO_DIRECTION: Record<string, ArrowDirection> = {
  [KeyCode.ArrowLeft]: 'left',
  [KeyCode.ArrowRight]: 'right',
  [KeyCode.ArrowUp]: 'up',
  [KeyCode.ArrowDown]: 'down',
};

export function useInputSpatialNav(getFocusTarget: (direction: ArrowDirection) => string) {
  const onKeyDownCapture = useCallback(
    (e: KeyboardEvent) => {
      if (!ARROW_KEYS.includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).blur();

      const direction = KEY_TO_DIRECTION[e.key];
      const targetKey = getFocusTarget(direction);
      requestAnimationFrame(() => setFocus(targetKey));
    },
    [getFocusTarget]
  );

  return { onKeyDownCapture };
}

