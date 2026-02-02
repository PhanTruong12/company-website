// createEngine.ts - Create Babylon.js engine
import { Engine } from '@babylonjs/core';

/**
 * Creates and initializes a Babylon.js engine
 * @param canvas - HTML canvas element
 * @returns Object containing the engine and cleanup function
 */
export const createEngine = (canvas: HTMLCanvasElement): { engine: Engine; cleanup: () => void } => {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  // Handle window resize
  const handleResize = () => {
    engine.resize();
  };
  window.addEventListener('resize', handleResize);

  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    engine.dispose();
  };

  return { engine, cleanup };
};
