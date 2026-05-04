import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type TouchEvent,
} from 'react';

type CarouselDirection = 'prev' | 'next';

type KeyboardScrollConfig =
  | boolean
  | {
      viewportRatio: number;
      minStep: number;
    };

type UseDragScrollOptions = {
  /** When this value changes, scroll resets to start and cursor is set to grab. */
  resetKey: string;
  /** Multiplier applied to pointer delta when updating scroll position while dragging. */
  dragMultiplier?: number;
  /** Arrow keys scroll by viewport (smooth). Pass `true` for defaults matching image carousels. */
  keyboard?: KeyboardScrollConfig;
};

type UseDragScrollResult = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (e: TouchEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  tabIndex?: number;
};

const DEFAULT_DRAG_MULTIPLIER = 1.5;
const DEFAULT_KEYBOARD = { viewportRatio: 0.82, minStep: 280 };

const resolveKeyboardConfig = (keyboard: KeyboardScrollConfig | undefined) => {
  if (keyboard === false || keyboard === undefined) return null;
  if (keyboard === true) return DEFAULT_KEYBOARD;
  return keyboard;
};

export const useDragScroll = ({
  resetKey,
  dragMultiplier = DEFAULT_DRAG_MULTIPLIER,
  keyboard = true,
}: UseDragScrollOptions): UseDragScrollResult => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftAtDragStart, setScrollLeftAtDragStart] = useState(0);

  const keyboardConfig = resolveKeyboardConfig(keyboard);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.style.cursor = 'grab';
    el.scrollTo({ left: 0, behavior: 'auto' });
  }, [resetKey]);

  const scrollByDirection = useCallback(
    (direction: CarouselDirection) => {
      const el = scrollContainerRef.current;
      if (!el || !keyboardConfig) return;

      const amount = Math.max(el.clientWidth * keyboardConfig.viewportRatio, keyboardConfig.minStep);
      el.scrollBy({
        left: direction === 'next' ? amount : -amount,
        behavior: 'smooth',
      });
    },
    [keyboardConfig]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!keyboardConfig) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByDirection('next');
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByDirection('prev');
      }
    },
    [keyboardConfig, scrollByDirection]
  );

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeftAtDragStart(el.scrollLeft);
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
    const el = scrollContainerRef.current;
    if (el) {
      el.style.cursor = 'grab';
    }
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    const el = scrollContainerRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.scrollSnapType = 'x mandatory';
    }
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = scrollContainerRef.current;
      if (!isDragging || !el) return;

      e.preventDefault();
      const walk = (e.pageX - startX) * dragMultiplier;
      el.scrollLeft = scrollLeftAtDragStart - walk;
    },
    [dragMultiplier, isDragging, scrollLeftAtDragStart, startX]
  );

  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeftAtDragStart(el.scrollLeft);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const el = scrollContainerRef.current;
      if (!isDragging || !el) return;

      const walk = (e.touches[0].pageX - startX) * dragMultiplier;
      el.scrollLeft = scrollLeftAtDragStart - walk;
    },
    [dragMultiplier, isDragging, scrollLeftAtDragStart, startX]
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    scrollContainerRef,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    ...(keyboardConfig ? { onKeyDown, tabIndex: 0 as const } : {}),
  };
};
