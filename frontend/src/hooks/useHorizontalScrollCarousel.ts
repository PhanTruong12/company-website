import { useCallback, useEffect, useRef, type KeyboardEvent, type RefObject } from 'react';

type CarouselDirection = 'prev' | 'next';

type UseHorizontalScrollCarouselOptions = {
  resetKey: string;
  viewportRatio: number;
  minStep: number;
};

type UseHorizontalScrollCarouselResult = {
  trackRef: RefObject<HTMLDivElement | null>;
  scrollByDirection: (direction: CarouselDirection) => void;
  handleArrowKeyScroll: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export const useHorizontalScrollCarousel = ({
  resetKey,
  viewportRatio,
  minStep,
}: UseHorizontalScrollCarouselOptions): UseHorizontalScrollCarouselResult => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [resetKey]);

  const scrollByDirection = useCallback(
    (direction: CarouselDirection) => {
      const track = trackRef.current;
      if (!track) return;

      const amount = Math.max(track.clientWidth * viewportRatio, minStep);
      track.scrollBy({
        left: direction === 'next' ? amount : -amount,
        behavior: 'smooth',
      });
    },
    [minStep, viewportRatio]
  );

  const handleArrowKeyScroll = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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
    [scrollByDirection]
  );

  return {
    trackRef,
    scrollByDirection,
    handleArrowKeyScroll,
  };
};

