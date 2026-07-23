export const WORLD = Object.freeze({
  width: 3200,
  height: 810,
  viewportWidth: 1440,
  viewportHeight: 810,
  groundY: 652,
});

export const PLAYER_PHYSICS = Object.freeze({
  moveSpeed: 390,
  groundAcceleration: 1850,
  airAcceleration: 980,
  groundFriction: 2300,
  gravity: 1760,
  jumpVelocity: 720,
  halfWidth: 74,
  bodyRadius: 72,
});

export function approach(current, target, maxDelta) {
  if (current < target) {
    return Math.min(current + maxDelta, target);
  }

  if (current > target) {
    return Math.max(current - maxDelta, target);
  }

  return target;
}

export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}
