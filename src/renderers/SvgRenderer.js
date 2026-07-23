import { PLAYER_PHYSICS, WORLD, clamp } from "../game/physics.js";
import dipperLogoUrl from "../../reference/dipper-logo.PNG?url";

const SVG_NS = "http://www.w3.org/2000/svg";

export class SvgRenderer {
  constructor(mount) {
    mount.innerHTML = this.createShell();

    this.stage = mount.querySelector("#game-stage");
    this.playerRoot = mount.querySelector("#player-root");
    this.characterMotion = mount.querySelector("#character-motion");
    this.body = mount.querySelector("#dipper-body");
    this.head = mount.querySelector("#dipper-head");
    this.face = mount.querySelector("#dipper-face");
    this.shadow = mount.querySelector("#player-shadow");
    this.stateLabel = mount.querySelector("[data-player-state]");
    this.speedLabel = mount.querySelector("[data-player-speed]");
    this.progress = mount.querySelector("[data-progress]");
    this.viewportWidth = WORLD.viewportWidth;

    this.updateViewport = this.updateViewport.bind(this);
    this.resizeObserver = new ResizeObserver(this.updateViewport);
    this.resizeObserver.observe(this.stage);
    this.updateViewport();
  }

  render(player, cameraX, time) {
    this.stage.setAttribute(
      "viewBox",
      `${cameraX.toFixed(2)} 0 ${this.viewportWidth.toFixed(2)} ${WORLD.viewportHeight}`,
    );

    const animation = this.getAnimation(player, time);
    const airborneHeight = Math.max(0, WORLD.groundY - player.position.y);
    const shadowScale = clamp(1 - airborneHeight / 620, 0.54, 1);
    const shadowOpacity = clamp(0.2 - airborneHeight / 2200, 0.07, 0.2);
    const headOffset = player.facing * 11;

    this.playerRoot.setAttribute(
      "transform",
      `translate(${player.position.x.toFixed(2)} ${player.position.y.toFixed(2)})`,
    );
    this.characterMotion.setAttribute(
      "transform",
      `translate(0 ${animation.bob.toFixed(2)}) scale(${animation.scaleX.toFixed(
        3,
      )} ${animation.scaleY.toFixed(3)})`,
    );
    this.body.setAttribute(
      "transform",
      `translate(0 -73) rotate(${player.bodyRotation.toFixed(2)})`,
    );
    this.head.setAttribute(
      "transform",
      `translate(${headOffset} -176) rotate(${animation.headTilt.toFixed(2)})`,
    );
    this.face.setAttribute("transform", `scale(${player.facing} 1)`);

    this.shadow.setAttribute("cx", player.position.x.toFixed(2));
    this.shadow.setAttribute("rx", (59 * shadowScale).toFixed(2));
    this.shadow.setAttribute("opacity", shadowOpacity.toFixed(3));

    this.stateLabel.textContent = player.state;
    this.speedLabel.textContent = `${Math.round(Math.abs(player.velocity.x))}`;
    this.progress.style.setProperty(
      "--progress",
      `${(player.position.x / WORLD.width) * 100}%`,
    );
  }

  updateViewport() {
    const { width, height } = this.stage.getBoundingClientRect();

    if (width <= 0 || height <= 0) {
      return;
    }

    this.viewportWidth = Math.min(
      WORLD.width,
      WORLD.viewportHeight * (width / height),
    );
  }

  getAnimation(player, time) {
    const animation = {
      bob: 0,
      scaleX: 1,
      scaleY: 1,
      headTilt: 0,
    };

    if (player.state === "idle") {
      animation.bob = Math.sin(time * 2.8) * 2.2;
      animation.scaleX = 1 + Math.sin(time * 2.8) * 0.006;
      animation.scaleY = 1 - Math.sin(time * 2.8) * 0.006;
      animation.headTilt = Math.sin(time * 1.8) * 1.6;
    }

    if (player.state === "move") {
      const stride = Math.sin(time * 9.5);
      animation.bob = -Math.abs(stride) * 5;
      animation.scaleX = 1 + Math.abs(stride) * 0.025;
      animation.scaleY = 1 - Math.abs(stride) * 0.02;
      animation.headTilt = -player.facing * 5 + stride * 2;
    }

    if (player.state === "jump") {
      animation.scaleX = 0.93;
      animation.scaleY = 1.075;
      animation.headTilt = -player.facing * 7;
    }

    if (player.state === "fall") {
      animation.scaleX = 1.035;
      animation.scaleY = 0.965;
      animation.headTilt = player.facing * 4;
    }

    if (player.state === "land") {
      const landingProgress = player.landingTime / 0.18;
      const squash = Math.sin(landingProgress * Math.PI);
      animation.bob = squash * 7;
      animation.scaleX = 1 + squash * 0.13;
      animation.scaleY = 1 - squash * 0.14;
      animation.headTilt = player.facing * squash * 7;
    }

    return animation;
  }

  createShell() {
    return `
      <main class="game-shell">
        <header class="game-header">
          <div class="brand-lockup">
            <img class="brand-mark" src="${dipperLogoUrl}" alt="" aria-hidden="true" />
            <div>
              <p class="eyebrow">Movement prototype 01</p>
              <h1>Dipper</h1>
            </div>
          </div>
          <div class="status-cluster" aria-live="polite">
            <span><small>State</small><strong data-player-state>idle</strong></span>
            <span><small>Speed</small><strong><b data-player-speed>0</b> px/s</strong></span>
          </div>
        </header>

        <section class="stage-frame" aria-label="Dipper movement prototype">
          <svg
            id="game-stage"
            class="game-stage"
            xmlns="${SVG_NS}"
            viewBox="0 0 ${WORLD.viewportWidth} ${WORLD.viewportHeight}"
            role="img"
            aria-label="A footless two-ball character moving across a side-scrolling test runway."
          >
            <defs>
              <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#62c4f0" />
                <stop offset="62%" stop-color="#bceafa" />
                <stop offset="100%" stop-color="#eefbff" />
              </linearGradient>
              <radialGradient id="body-gradient" cx="32%" cy="23%" r="78%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="72%" stop-color="#f7fbff" />
                <stop offset="100%" stop-color="#cdd8e4" />
              </radialGradient>
              <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="10"
                  flood-color="#0d3659"
                  flood-opacity="0.2"
                />
              </filter>
              <filter id="cloud-softness" x="-10%" y="-20%" width="120%" height="150%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            <rect width="${WORLD.width}" height="${WORLD.height}" fill="url(#sky-gradient)" />
            ${this.createClouds()}
            ${this.createDistanceMarkers()}

            <g id="runway">
              <rect
                x="0"
                y="${WORLD.groundY + 7}"
                width="${WORLD.width}"
                height="180"
                rx="10"
                fill="#f8fcff"
                stroke="#124f97"
                stroke-width="6"
              />
              <path
                d="M 0 ${WORLD.groundY + 27} H ${WORLD.width}"
                stroke="#80b9e7"
                stroke-width="3"
                stroke-dasharray="26 16"
              />
              <path
                d="M 0 ${WORLD.groundY + 51} H ${WORLD.width}"
                stroke="#d2eafa"
                stroke-width="2"
              />
            </g>

            <ellipse
              id="player-shadow"
              cx="320"
              cy="${WORLD.groundY + 11}"
              rx="59"
              ry="13"
              fill="#174a73"
              opacity="0.2"
            />

            <g id="player-root" transform="translate(320 ${WORLD.groundY})">
              <g id="character-motion" filter="url(#soft-shadow)">
                <g id="dipper-body" transform="translate(0 -73)">
                  <circle r="72" fill="url(#body-gradient)" stroke="#101b2c" stroke-width="7" />
                  <path
                    d="M -48 -42 A 58 58 0 0 1 -57 15"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="9"
                    stroke-linecap="round"
                    opacity="0.92"
                  />
                  <g id="dipper-logo" transform="translate(0 4)">
                    <image
                      href="${dipperLogoUrl}"
                      x="-43"
                      y="-46.5"
                      width="86"
                      height="93"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </g>
                </g>

                <g id="dipper-head" transform="translate(11 -176)">
                  <circle r="43" fill="url(#body-gradient)" stroke="#101b2c" stroke-width="7" />
                  <path
                    d="M -25 -27 A 34 34 0 0 1 -31 4"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="7"
                    stroke-linecap="round"
                    opacity="0.92"
                  />
                  <g id="dipper-face">
                    <ellipse cx="0" cy="-5" rx="10" ry="17" fill="#ffffff" stroke="#101b2c" stroke-width="4" />
                    <ellipse cx="5" cy="-2" rx="4" ry="8" fill="#101b2c" />
                    <circle cx="6.5" cy="-5" r="1.8" fill="#ffffff" />
                    <ellipse cx="21" cy="-4" rx="12" ry="19" fill="#ffffff" stroke="#101b2c" stroke-width="4" />
                    <ellipse cx="27" cy="-1" rx="5" ry="9" fill="#101b2c" />
                    <circle cx="29" cy="-5" r="2.2" fill="#ffffff" />
                  </g>
                </g>
              </g>
            </g>
          </svg>

          <div class="stage-vignette" aria-hidden="true"></div>
          <div class="progress-track" aria-hidden="true">
            <span data-progress></span>
          </div>
        </section>

        <footer class="game-controls">
          <div class="control-copy">
            <p class="eyebrow">Prototype controls</p>
            <p><kbd>A</kbd><kbd>D</kbd> or arrow keys to move · <kbd>Space</kbd> to jump</p>
          </div>
          <div class="touch-controls" aria-label="On-screen movement controls">
            <button type="button" data-input="left" aria-label="Move left">←</button>
            <button type="button" data-input="jump" aria-label="Jump">↑</button>
            <button type="button" data-input="right" aria-label="Move right">→</button>
          </div>
        </footer>
      </main>
    `;
  }

  createClouds() {
    const clouds = [
      [160, 180, 1.15, 0.82],
      [720, 130, 0.72, 0.62],
      [1190, 240, 1.3, 0.72],
      [1690, 145, 0.96, 0.76],
      [2240, 235, 1.18, 0.67],
      [2860, 120, 0.84, 0.73],
    ];

    return clouds
      .map(
        ([x, y, scale, opacity]) => `
          <g
            transform="translate(${x} ${y}) scale(${scale})"
            fill="#ffffff"
            opacity="${opacity}"
            filter="url(#cloud-softness)"
          >
            <ellipse cx="-58" cy="8" rx="68" ry="35" />
            <ellipse cx="-10" cy="-18" rx="62" ry="55" />
            <ellipse cx="49" cy="3" rx="77" ry="42" />
          </g>
        `,
      )
      .join("");
  }

  createDistanceMarkers() {
    return Array.from({ length: 9 }, (_, index) => {
      const x = 270 + index * 365;
      const height = 42 + (index % 3) * 18;

      return `
        <g transform="translate(${x} ${WORLD.groundY - height})" opacity="0.38">
          <path d="M 0 ${height} V 0" stroke="#236aa8" stroke-width="4" stroke-linecap="round" />
          <circle cy="0" r="8" fill="#ffffff" stroke="#236aa8" stroke-width="3" />
        </g>
      `;
    }).join("");
  }
}
