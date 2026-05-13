(function () {
  const HERO_SELECTOR = "[data-post-hero]";
  const DPR_LIMIT = 2;
  const DEFAULT_TYPE = "contour";
  const DEFAULT_MOTION = "hover";
  const MOTION_PREVIEW_PARAM = "heroMotion";

  let forceMotionPreview = false;

  try {
    forceMotionPreview = new URLSearchParams(window.location.search).get(MOTION_PREVIEW_PARAM) === "preview";
  } catch (error) {
    forceMotionPreview = false;
  }

  if (forceMotionPreview) {
    document.documentElement.classList.add("hero-motion-preview");
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const hashString = (value) => {
    let hash = 2166136261;
    const input = String(value || "post-hero");

    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  };

  const seededUnit = (seed, salt) => {
    const x = Math.sin(seed * 0.0001 + salt * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const getCssColor = (element, property, fallback) => {
    const value = getComputedStyle(element).getPropertyValue(property).trim();
    return value || fallback;
  };

  class PostHero {
    constructor(root) {
      this.root = root;
      this.canvas = root.querySelector("canvas");
      this.context = this.canvas && this.canvas.getContext("2d");
      this.type = root.dataset.heroType || DEFAULT_TYPE;
      this.motion = root.dataset.heroMotion || DEFAULT_MOTION;
      this.seed = hashString(root.dataset.heroSeed);
      this.intensity = clamp(Number(root.dataset.heroIntensity) || 0.65, 0.1, 1);
      this.pointer = { x: 0.5, y: 0.5 };
      this.targetPointer = { x: 0.5, y: 0.5 };
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.raf = 0;
      this.visible = true;
      this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = !forceMotionPreview && this.reducedMotionQuery.matches;

      if (!this.context) return;

      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerLeave = this.handlePointerLeave.bind(this);
      this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);
      this.renderFrame = this.renderFrame.bind(this);
      this.resize = this.resize.bind(this);

      this.bindEvents();
      this.resize();
      this.start();
    }

    bindEvents() {
      const pointerTarget = this.root.closest("d-title") || this.root;
      pointerTarget.addEventListener("pointermove", this.handlePointerMove);
      pointerTarget.addEventListener("pointerleave", this.handlePointerLeave);

      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.root);
      } else {
        window.addEventListener("resize", this.resize);
      }

      if (typeof IntersectionObserver !== "undefined") {
        this.intersectionObserver = new IntersectionObserver((entries) => {
          this.visible = entries.some((entry) => entry.isIntersecting);
          if (this.visible) this.start();
        });
        this.intersectionObserver.observe(this.root);
      }

      if (typeof this.reducedMotionQuery.addEventListener === "function") {
        this.reducedMotionQuery.addEventListener("change", this.handleReducedMotionChange);
      } else if (typeof this.reducedMotionQuery.addListener === "function") {
        this.reducedMotionQuery.addListener(this.handleReducedMotionChange);
      }

      this.themeObserver = new MutationObserver(() => {
        this.draw(performance.now());
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    handlePointerMove(event) {
      if (this.reducedMotion || this.motion === "none") return;

      const rect = this.root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      this.targetPointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      this.targetPointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      if (this.motion === "hover") this.start();
    }

    handlePointerLeave() {
      this.targetPointer.x = 0.5;
      this.targetPointer.y = 0.5;
      if (this.motion === "hover") this.start();
    }

    handleReducedMotionChange(event) {
      this.reducedMotion = !forceMotionPreview && event.matches;
      this.targetPointer.x = 0.5;
      this.targetPointer.y = 0.5;
      this.pointer.x = 0.5;
      this.pointer.y = 0.5;
      this.start();
    }

    resize() {
      const rect = this.root.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const nextDpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);

      if (nextWidth === this.width && nextHeight === this.height && nextDpr === this.dpr) {
        return;
      }

      this.width = nextWidth;
      this.height = nextHeight;
      this.dpr = nextDpr;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.start();
    }

    start() {
      if (this.raf) return;
      this.raf = window.requestAnimationFrame(this.renderFrame);
    }

    renderFrame(timestamp) {
      this.raf = 0;
      this.draw(timestamp);

      if (!this.visible || this.reducedMotion || this.motion === "none") return;

      const pointerDelta = Math.abs(this.pointer.x - this.targetPointer.x) + Math.abs(this.pointer.y - this.targetPointer.y);
      const shouldContinue = this.motion === "auto" || pointerDelta > 0.002;

      if (shouldContinue) {
        this.raf = window.requestAnimationFrame(this.renderFrame);
      }
    }

    draw(timestamp) {
      if (!this.width || !this.height) return;

      const context = this.context;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      this.pointer.x += (this.targetPointer.x - this.pointer.x) * 0.08;
      this.pointer.y += (this.targetPointer.y - this.pointer.y) * 0.08;

      const palette = {
        ink: getCssColor(this.root, "--post-hero-ink", "rgba(24, 20, 36, 0.78)"),
        accent: getCssColor(this.root, "--post-hero-accent", "rgba(92, 73, 196, 0.34)"),
      };
      const time = this.reducedMotion ? 0 : timestamp * 0.001;

      if (this.type === "halftone") {
        this.drawHalftone(context, palette, time);
      } else if (this.type === "waves") {
        this.drawWaves(context, palette, time);
      } else {
        this.drawContour(context, palette, time);
      }
    }

    getPhase(time) {
      if (this.motion === "auto") return time * 0.42;
      return (this.pointer.x - 0.5) * 2.6 + (this.pointer.y - 0.5) * 1.4;
    }

    drawContour(context, palette, time) {
      const width = this.width;
      const height = this.height;
      const phase = this.getPhase(time);
      const spacing = 15 - this.intensity * 5;
      const amplitude = height * (0.055 + this.intensity * 0.045);
      const lines = Math.ceil(width / spacing) + 8;
      const pointerX = width * this.pointer.x;
      const pointerY = height * this.pointer.y;

      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = clamp(spacing * 0.11, 0.8, 1.5);
      context.strokeStyle = palette.ink;

      for (let line = -4; line < lines; line += 1) {
        const baseX = line * spacing;
        const salt = seededUnit(this.seed, line);
        const drift = (salt - 0.5) * spacing * 1.4;

        context.globalAlpha = clamp(0.16 + line / lines, 0.12, 0.82);
        context.beginPath();

        for (let y = -24; y <= height + 24; y += 8) {
          const normalizedY = y / Math.max(height, 1);
          const field = Math.sin(normalizedY * 12 + line * 0.23 + phase + salt * 5) + Math.sin(normalizedY * 25 - line * 0.12 + phase * 0.7) * 0.42;
          const distanceX = baseX - pointerX;
          const distanceY = y - pointerY;
          const pointerPull = Math.exp(-(distanceX * distanceX + distanceY * distanceY) / 42000) * (this.pointer.x - 0.5) * 90;
          const x = baseX + drift + field * amplitude + pointerPull;

          if (y === -24) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.stroke();
      }

      context.globalAlpha = 1;
    }

    drawHalftone(context, palette, time) {
      const width = this.width;
      const height = this.height;
      const phase = this.getPhase(time);
      const spacing = 14 - this.intensity * 5;
      const focusX = width * (0.22 + seededUnit(this.seed, 3) * 0.58);
      const focusY = height * (0.22 + seededUnit(this.seed, 7) * 0.48);
      const pointerX = width * this.pointer.x;
      const pointerY = height * this.pointer.y;

      context.fillStyle = palette.ink;

      for (let y = -spacing; y <= height + spacing; y += spacing) {
        const rowOffset = Math.round(y / spacing) % 2 === 0 ? 0 : spacing * 0.5;

        for (let x = -spacing; x <= width + spacing; x += spacing) {
          const px = x + rowOffset;
          const wave = (Math.sin(px * 0.016 + phase + this.seed * 0.00003) + Math.cos(y * 0.022 - phase * 1.2 + this.seed * 0.00004) + 2) / 4;
          const focusDistance = Math.hypot(px - focusX, y - focusY) / Math.max(width, height);
          const pointerDistance = Math.hypot(px - pointerX, y - pointerY) / Math.max(width, height);
          const focus = clamp(1 - focusDistance * 1.45, 0, 1);
          const hover = clamp(1 - pointerDistance * 3.4, 0, 1) * 0.35;
          const value = clamp(wave * 0.46 + focus * 0.5 + hover, 0, 1);
          const radius = value * spacing * 0.34;

          if (radius < 0.45) continue;

          context.globalAlpha = clamp(value * 0.58, 0.1, 0.62);
          context.beginPath();
          context.arc(px, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.globalAlpha = 1;
    }

    drawWaves(context, palette, time) {
      const width = this.width;
      const height = this.height;
      const phase = this.getPhase(time);
      const spacing = 12 - this.intensity * 3;
      const amplitude = height * (0.06 + this.intensity * 0.055);
      const pointerX = width * this.pointer.x;
      const pointerY = height * this.pointer.y;
      const lines = Math.ceil(height / spacing) + 8;

      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = clamp(spacing * 0.1, 0.75, 1.35);
      context.strokeStyle = palette.ink;

      for (let line = -4; line < lines; line += 1) {
        const baseY = line * spacing;
        const salt = seededUnit(this.seed, line + 19);

        context.globalAlpha = clamp(0.12 + line / lines, 0.1, 0.72);
        context.beginPath();

        for (let x = -24; x <= width + 24; x += 8) {
          const normalizedX = x / Math.max(width, 1);
          const field = Math.sin(normalizedX * 10 + line * 0.18 + phase + salt * 6) + Math.sin(normalizedX * 21 - line * 0.09 + phase * 0.65) * 0.48;
          const distanceX = x - pointerX;
          const distanceY = baseY - pointerY;
          const pointerLift = Math.exp(-(distanceX * distanceX + distanceY * distanceY) / 52000) * (this.pointer.y - 0.5) * 70;
          const y = baseY + field * amplitude + pointerLift;

          if (x === -24) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.stroke();
      }

      context.globalAlpha = 1;

      context.globalAlpha = 0.22;
      context.strokeStyle = palette.accent;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(width * 0.58, -12);
      context.lineTo(width * 0.32 + (this.pointer.x - 0.5) * 30, height + 12);
      context.stroke();
      context.globalAlpha = 1;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(HERO_SELECTOR).forEach((element) => new PostHero(element));
  });
})();
