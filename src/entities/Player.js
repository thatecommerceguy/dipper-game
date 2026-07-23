import {
  PLAYER_PHYSICS,
  WORLD,
  approach,
  clamp,
} from "../game/physics.js";

export class Player {
  constructor() {
    this.position = {
      x: 320,
      y: WORLD.groundY,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.facing = 1;
    this.grounded = true;
    this.state = "idle";
    this.stateTime = 0;
    this.bodyRotation = 0;
    this.landingTime = 0;
  }

  update(deltaTime, input) {
    let jumped = false;
    const direction = input.horizontal;
    const acceleration = this.grounded
      ? PLAYER_PHYSICS.groundAcceleration
      : PLAYER_PHYSICS.airAcceleration;

    if (direction !== 0) {
      this.velocity.x = approach(
        this.velocity.x,
        direction * PLAYER_PHYSICS.moveSpeed,
        acceleration * deltaTime,
      );
      this.facing = direction;
    } else if (this.grounded) {
      this.velocity.x = approach(
        this.velocity.x,
        0,
        PLAYER_PHYSICS.groundFriction * deltaTime,
      );
    }

    if (input.consumeJump() && this.grounded) {
      this.velocity.y = -PLAYER_PHYSICS.jumpVelocity;
      this.grounded = false;
      this.landingTime = 0;
      jumped = true;
    }

    if (!this.grounded) {
      this.velocity.y += PLAYER_PHYSICS.gravity * deltaTime;
    }

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    const minimumX = PLAYER_PHYSICS.halfWidth;
    const maximumX = WORLD.width - PLAYER_PHYSICS.halfWidth;
    const clampedX = clamp(this.position.x, minimumX, maximumX);

    if (clampedX !== this.position.x) {
      this.velocity.x = 0;
      this.position.x = clampedX;
    }

    if (this.position.y >= WORLD.groundY) {
      if (!this.grounded && this.velocity.y > 80) {
        this.landingTime = 0.18;
      }

      this.position.y = WORLD.groundY;
      this.velocity.y = 0;
      this.grounded = true;
    }

    if (this.landingTime > 0) {
      this.landingTime = Math.max(0, this.landingTime - deltaTime);
    }

    this.bodyRotation +=
      (this.velocity.x / PLAYER_PHYSICS.bodyRadius) *
      deltaTime *
      (180 / Math.PI);

    this.updateState(deltaTime);

    return { jumped };
  }

  updateState(deltaTime) {
    let nextState = "idle";

    if (this.landingTime > 0) {
      nextState = "land";
    } else if (!this.grounded) {
      nextState = this.velocity.y < 40 ? "jump" : "fall";
    } else if (Math.abs(this.velocity.x) > 24) {
      nextState = "move";
    }

    if (nextState !== this.state) {
      this.state = nextState;
      this.stateTime = 0;
    } else {
      this.stateTime += deltaTime;
    }
  }
}
