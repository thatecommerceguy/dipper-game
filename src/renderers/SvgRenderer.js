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
    this.jetpackRoot = mount.querySelector("#jetpack-root");
    this.jetpackPickup = mount.querySelector("#jetpack-pickup");
    this.snowflakes = [...mount.querySelectorAll(".snowflake-particle")];
    this.shadow = mount.querySelector("#player-shadow");
    this.stateLabel = mount.querySelector("[data-player-state]");
    this.speedLabel = mount.querySelector("[data-player-speed]");
    this.powerupChip = mount.querySelector("[data-powerup-status]");
    this.powerupTime = mount.querySelector("[data-powerup-time]");
    this.progress = mount.querySelector("[data-progress]");
    this.viewportWidth = WORLD.viewportWidth;

    this.updateViewport = this.updateViewport.bind(this);
    this.resizeObserver = new ResizeObserver(this.updateViewport);
    this.resizeObserver.observe(this.stage);
    this.updateViewport();
  }

  render(player, jetpackPowerUp, cameraX, time) {
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
    this.jetpackRoot.setAttribute(
      "visibility",
      player.jetpackActive ? "visible" : "hidden",
    );
    this.jetpackRoot.setAttribute("transform", `scale(${player.facing} 1)`);
    this.renderSnowflakes(player, time);

    this.shadow.setAttribute("cx", player.position.x.toFixed(2));
    this.shadow.setAttribute("rx", (59 * shadowScale).toFixed(2));
    this.shadow.setAttribute("opacity", shadowOpacity.toFixed(3));

    this.stateLabel.textContent = player.state;
    this.speedLabel.textContent = `${Math.round(Math.abs(player.velocity.x))}`;
    this.powerupChip.classList.toggle("is-active", player.jetpackActive);
    this.powerupChip.setAttribute("aria-hidden", String(!player.jetpackActive));
    this.powerupTime.textContent = `${player.jetpackTimeRemaining.toFixed(1)}s`;

    const pickupBob = Math.sin(time * 3.2) * 8;
    this.jetpackPickup.setAttribute(
      "transform",
      `translate(${jetpackPowerUp.position.x} ${(jetpackPowerUp.position.y + pickupBob).toFixed(2)})`,
    );
    this.jetpackPickup.setAttribute(
      "visibility",
      jetpackPowerUp.collected ? "hidden" : "visible",
    );

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

    if (player.state === "fly") {
      animation.bob = Math.sin(time * 7.5) * 3;
      animation.scaleX = 0.985;
      animation.scaleY = 1.015;
      animation.headTilt = -player.facing * 6 + Math.sin(time * 3.5) * 2;
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

  renderSnowflakes(player, time) {
    if (!player.jetpackActive) {
      return;
    }

    this.snowflakes.forEach((snowflake, index) => {
      const progress = (time * 1.45 + index * 0.21) % 1;
      const drift = Math.sin(progress * Math.PI * 2 + index * 1.7) * 13;
      const x = -81 + drift;
      const y = -34 + progress * 104;
      const scale = 0.45 + progress * 0.7;
      const rotation = progress * 260 + index * 43;
      const opacity = Math.sin(progress * Math.PI);

      snowflake.setAttribute(
        "transform",
        `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)}) scale(${scale.toFixed(2)})`,
      );
      snowflake.setAttribute("opacity", opacity.toFixed(2));
    });
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
          <div class="header-actions">
            <div class="status-cluster" aria-live="polite">
              <span><small>State</small><strong data-player-state>idle</strong></span>
              <span><small>Speed</small><strong><b data-player-speed>0</b> px/s</strong></span>
            </div>
            <div
              class="powerup-chip"
              data-powerup-status
              aria-hidden="true"
              aria-live="polite"
            >
              <span aria-hidden="true">❄</span>
              <span><small>Jetpack</small><strong data-powerup-time>10.0s</strong></span>
            </div>
            <button
              class="audio-toggle"
              type="button"
              data-audio-toggle
              aria-label="Mute sound"
              aria-pressed="false"
            >
              <span aria-hidden="true">♪</span>
              <span data-audio-label>Sound on</span>
            </button>
          </div>
        </header>

        <section class="stage-frame" aria-label="Dipper movement prototype">
          <video
            class="cloud-background"
            src="/video/clouds.mp4"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            aria-hidden="true"
          ></video>
          <svg
            id="game-stage"
            class="game-stage"
            xmlns="${SVG_NS}"
            viewBox="0 0 ${WORLD.viewportWidth} ${WORLD.viewportHeight}"
            role="img"
            aria-label="A footless two-ball character moving across a side-scrolling test runway."
          >
            <defs>
              <radialGradient id="body-gradient" cx="32%" cy="23%" r="78%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="72%" stop-color="#f7fbff" />
                <stop offset="100%" stop-color="#cdd8e4" />
              </radialGradient>
              <radialGradient id="jetpack-glow">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="52%" stop-color="#bdefff" stop-opacity="0.62" />
                <stop offset="100%" stop-color="#67c7ff" stop-opacity="0" />
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
              <filter id="powerup-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="10"
                  flood-color="#7d2cff"
                  flood-opacity="0.42"
                />
              </filter>
            </defs>

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

            ${this.createJetpackPickup()}

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
                ${this.createEquippedJetpack()}

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
            <p><kbd>A</kbd><kbd>D</kbd> or arrows to move · <kbd>Space</kbd> to jump / fly</p>
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

  createEquippedJetpack() {
    const snowflakes = Array.from({ length: 6 }, (_, index) => `
      <path
        class="snowflake-particle"
        data-snowflake="${index}"
        d="M -7 0 H 7 M 0 -7 V 7 M -5 -5 L 5 5 M 5 -5 L -5 5"
        fill="none"
        stroke="#e8fbff"
        stroke-width="2.4"
        stroke-linecap="round"
      />
    `).join("");

    return `
      <g id="jetpack-root" visibility="hidden">
        <g aria-hidden="true">
          ${snowflakes}
        </g>
        <g>
          <path
            d="M -61 -116 C -47 -112 -44 -101 -43 -82 C -44 -66 -49 -58 -61 -56"
            fill="none"
            stroke="#101b2c"
            stroke-width="6"
            stroke-linecap="round"
          />
          <rect
            x="-103"
            y="-132"
            width="44"
            height="82"
            rx="18"
            fill="#f8fdff"
            stroke="#101b2c"
            stroke-width="6"
          />
          <path
            d="M -94 -106 H -68 M -94 -88 H -68"
            stroke="#79c8ef"
            stroke-width="5"
            stroke-linecap="round"
          />
          <circle cx="-81" cy="-118" r="6" fill="#7d2cff" />
          <path
            d="M -94 -49 L -68 -49 L -64 -35 L -98 -35 Z"
            fill="#9ee8ff"
            stroke="#101b2c"
            stroke-width="5"
            stroke-linejoin="round"
          />
          <path
            d="M -88 -71 H -74 M -81 -78 V -64 M -86 -76 L -76 -66 M -76 -76 L -86 -66"
            stroke="#276a9f"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </g>
      </g>
    `;
  }

  createJetpackPickup() {
    return `
      <g id="jetpack-pickup" transform="translate(1040 560)">
        <circle r="76" fill="url(#jetpack-glow)" />
        <g filter="url(#powerup-glow)">
          <rect
            x="-23"
            y="-48"
            width="46"
            height="78"
            rx="19"
            fill="#f8fdff"
            stroke="#101b2c"
            stroke-width="6"
          />
          <path
            d="M 23 -31 C 40 -26 41 6 23 14"
            fill="none"
            stroke="#101b2c"
            stroke-width="6"
            stroke-linecap="round"
          />
          <path
            d="M -17 -25 H 15 M -17 -8 H 15"
            stroke="#79c8ef"
            stroke-width="5"
            stroke-linecap="round"
          />
          <circle cy="-34" r="6" fill="#7d2cff" />
          <path
            d="M -16 29 H 16 L 21 44 H -21 Z"
            fill="#9ee8ff"
            stroke="#101b2c"
            stroke-width="5"
            stroke-linejoin="round"
          />
          <path
            d="M -9 9 H 9 M 0 0 V 18 M -6 3 L 6 15 M 6 3 L -6 15"
            stroke="#276a9f"
            stroke-width="2.8"
            stroke-linecap="round"
          />
        </g>
      </g>
    `;
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
