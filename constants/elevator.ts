export const MIN_FLOOR = 1;
export const MAX_FLOOR = 7;

export const ELEVATOR_FLOORS = Array.from(
  { length: MAX_FLOOR },
  (_, index) => MIN_FLOOR + index,
);
