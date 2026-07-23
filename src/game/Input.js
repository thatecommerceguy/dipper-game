const KEY_BINDINGS = Object.freeze({
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "jump",
  KeyW: "jump",
  Space: "jump",
});

export class Input {
  constructor(root) {
    this.root = root;
    this.held = {
      left: false,
      right: false,
      jump: false,
    };
    this.jumpQueued = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onWindowBlur = this.reset.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onWindowBlur);

    this.bindPointerControls();
  }

  get horizontal() {
    return Number(this.held.right) - Number(this.held.left);
  }

  consumeJump() {
    const queued = this.jumpQueued;
    this.jumpQueued = false;
    return queued;
  }

  onKeyDown(event) {
    const action = KEY_BINDINGS[event.code];

    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === "jump" && !this.held.jump) {
      this.jumpQueued = true;
    }

    this.held[action] = true;
  }

  onKeyUp(event) {
    const action = KEY_BINDINGS[event.code];

    if (!action) {
      return;
    }

    event.preventDefault();
    this.held[action] = false;
  }

  bindPointerControls() {
    const controls = this.root.querySelectorAll("[data-input]");

    controls.forEach((control) => {
      const action = control.dataset.input;

      const press = (event) => {
        event.preventDefault();
        control.setPointerCapture?.(event.pointerId);

        if (action === "jump" && !this.held.jump) {
          this.jumpQueued = true;
        }

        this.held[action] = true;
        control.classList.add("is-pressed");
      };

      const release = (event) => {
        event.preventDefault();
        this.held[action] = false;
        control.classList.remove("is-pressed");
      };

      control.addEventListener("pointerdown", press);
      control.addEventListener("pointerup", release);
      control.addEventListener("pointercancel", release);
      control.addEventListener("lostpointercapture", release);
    });
  }

  reset() {
    this.held.left = false;
    this.held.right = false;
    this.held.jump = false;
    this.jumpQueued = false;

    this.root
      .querySelectorAll(".is-pressed")
      .forEach((control) => control.classList.remove("is-pressed"));
  }
}
