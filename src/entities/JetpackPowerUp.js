import {
  JETPACK_POWERUP,
  PLAYER_PHYSICS,
} from "../game/physics.js";

export class JetpackPowerUp {
  constructor() {
    this.position = {
      x: JETPACK_POWERUP.pickupX,
      y: JETPACK_POWERUP.pickupY,
    };
    this.collected = false;
  }

  tryCollect(player) {
    if (this.collected) {
      return false;
    }

    const playerCenterY = player.position.y - 92;
    const deltaX = player.position.x - this.position.x;
    const deltaY = playerCenterY - this.position.y;
    const collectionDistance =
      JETPACK_POWERUP.pickupRadius + PLAYER_PHYSICS.halfWidth;

    if (deltaX * deltaX + deltaY * deltaY > collectionDistance ** 2) {
      return false;
    }

    this.collected = true;
    return true;
  }
}
