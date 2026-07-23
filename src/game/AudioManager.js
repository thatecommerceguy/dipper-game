const PUBLIC_BASE_URL = import.meta.env.BASE_URL;

const AUDIO_PATHS = Object.freeze({
  background: `${PUBLIC_BASE_URL}audio/background-loop.wav`,
  jump: `${PUBLIC_BASE_URL}audio/jump.wav`,
});

export class AudioManager {
  constructor(root) {
    this.root = root;
    this.hasStarted = false;
    this.isMuted = false;

    this.background = new Audio(AUDIO_PATHS.background);
    this.background.loop = true;
    this.background.preload = "auto";
    this.background.volume = 0.22;

    this.jump = new Audio(AUDIO_PATHS.jump);
    this.jump.preload = "auto";
    this.jump.volume = 0.55;

    this.toggleButton = root.querySelector("[data-audio-toggle]");
    this.toggleLabel = root.querySelector("[data-audio-label]");

    this.onFirstInteraction = this.onFirstInteraction.bind(this);
    this.toggleMuted = this.toggleMuted.bind(this);

    window.addEventListener("keydown", this.onFirstInteraction);
    root.addEventListener("pointerdown", this.onFirstInteraction);
    this.toggleButton?.addEventListener("click", this.toggleMuted);

    this.updateToggle();
  }

  onFirstInteraction(event) {
    if (event.target instanceof Element && event.target.closest("[data-audio-toggle]")) {
      return;
    }

    this.startBackground();
  }

  startBackground() {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    this.background.play().catch(() => {
      this.hasStarted = false;
    });
  }

  playJump() {
    if (this.isMuted) {
      return;
    }

    this.jump.currentTime = 0;
    this.jump.play().catch(() => {});
  }

  toggleMuted() {
    this.isMuted = !this.isMuted;
    this.background.muted = this.isMuted;
    this.jump.muted = this.isMuted;

    if (!this.isMuted) {
      this.startBackground();
    }

    this.updateToggle();
  }

  updateToggle() {
    if (!this.toggleButton || !this.toggleLabel) {
      return;
    }

    this.toggleButton.setAttribute("aria-pressed", String(this.isMuted));
    this.toggleButton.setAttribute(
      "aria-label",
      this.isMuted ? "Turn sound on" : "Mute sound",
    );
    this.toggleLabel.textContent = this.isMuted ? "Sound off" : "Sound on";
  }
}
