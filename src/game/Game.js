import { Player } from "../entities/Player.js";
import { SvgRenderer } from "../renderers/SvgRenderer.js";
import { AudioManager } from "./AudioManager.js";
import { Input } from "./Input.js";
import { WORLD, clamp } from "./physics.js";

export class Game {
  constructor(mount) {
    this.renderer = new SvgRenderer(mount);
    this.audio = new AudioManager(mount);
    this.input = new Input(mount);
    this.player = new Player();
    this.cameraX = 0;
    this.lastTimestamp = 0;
    this.animationFrame = null;
    this.tick = this.tick.bind(this);
  }

  start() {
    this.renderer.render(this.player, this.cameraX, 0);
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  tick(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 1 / 30);
    this.lastTimestamp = timestamp;

    const events = this.player.update(deltaTime, this.input);

    if (events.jumped) {
      this.audio.playJump();
    }

    this.updateCamera(deltaTime);
    this.renderer.render(this.player, this.cameraX, timestamp / 1000);

    this.animationFrame = requestAnimationFrame(this.tick);
  }

  updateCamera(deltaTime) {
    const viewportWidth = this.renderer.viewportWidth;
    const desiredX = clamp(
      this.player.position.x - viewportWidth * 0.42,
      0,
      Math.max(0, WORLD.width - viewportWidth),
    );
    const smoothing = 1 - Math.exp(-5.5 * deltaTime);

    this.cameraX += (desiredX - this.cameraX) * smoothing;
  }
}
