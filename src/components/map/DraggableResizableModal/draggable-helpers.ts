export const MINIMIZED_HEIGHT = 50;
export const DEFAULT_SIZE: [number, number] = [500, 700];
export const DEFAULT_MIN_SIZE: [number, number] = [200, 200];

export const calculateSize = (size: [number, number], maxSize?: [number, number]): [number, number] => {
  const [maxWidth, maxHeight] = calculateMaxSize(maxSize);
  const width = calculateDimension(size[0], maxWidth);
  const height = calculateDimension(size[1], maxHeight);
  return [width, height];
};

export const calculateMaxSize = (maxSize?: [number, number]): [number, number] => {
  if (maxSize) {
    return maxSize;
  }
  return [window.innerWidth * 0.9, window.innerHeight * 0.7];
};

export const calculateDimension = (dimension: number, maxDimension: number): number =>
  dimension > maxDimension ? maxDimension : dimension;

export const getDraggableBounds = (size: [number, number], top: number = 0, left: number = 0) => ({
  top: 0 - top,
  bottom: window.innerHeight - size[1] - top,
  left: 0 - left,
  right: window.innerWidth - size[0] - left,
});

export const getDefaultTop = () => (getMobile() ? 24 : 100);

export const getDefaultLeft = () => (getMobile() ? 16 : 100);

const getMobile = (): boolean => window.matchMedia('(max-width: 600px)').matches;
