
(() => {
  const nodes = Array.from(
    document.querySelectorAll(".floating")
  );

  const seeWork = document.querySelector(".see-work");
  const line = document.querySelector(".flann-line");

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let queued = false;

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const mix = (a, b, t) => a + (b - a) * t;

  function update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mobile = w <= 600;
    const margin = mobile ? 16 : 30;

    // Scroll progress: 0 = intro, 1 = header
    const raw = clamp(
      window.scrollY / (h * 0.7),
      0,
      1
    );

    const t = reduced.matches
      ? (raw > 0 ? 1 : 0)
      : raw * raw * (3 - 2 * raw);

    // --------------------------------
    // POSITION AND SCALE
    // --------------------------------

    nodes.forEach((el) => {
      let sx = Number(el.dataset.startX) / 100 * w;
      let sy = Number(el.dataset.startY) / 100 * h;

      const angle = Number(el.dataset.angle) || 0;

      const isTitle = el.classList.contains("flann");

      const isLeft =
        el.classList.contains("description") ||
        el.classList.contains("location");

      const secondRow =
        el.classList.contains("location") ||
        el.classList.contains("mail");

      // Mobile starting positions
      if (mobile) {
        if (el.classList.contains("description")) {
          sx = w * 0.34;
        }

        if (el.classList.contains("location")) {
          sx = w * 0.28;
        }
      }

      // Final header positions
      const endY = isTitle
        ? (mobile ? 29 : 28)
        : (mobile
          ? (secondRow ? 125 : 85)
          : (secondRow ? 75 : 26));

      const endX = isTitle
        ? w / 2
        : (isLeft
          ? margin + el.offsetWidth / 2
          : w - margin - el.offsetWidth / 2);

      // Text becomes smaller while scrolling
      const scale = isTitle
        ? mix(1, mobile ? 0.5 : 0.47, t)
        : mix(1, mobile ? 0.65 : 0.7, t);

      // Apply position
      el.style.left = `${mix(sx, endX, t)}px`;
      el.style.top = `${mix(sy, endY, t)}px`;

      // Keep original rotation
      el.style.setProperty("--angle", `${angle}deg`);

      // Apply scale
      el.style.setProperty("--scale", scale);
    });

    // --------------------------------
    // VECTOR COLOR ANIMATION
    // --------------------------------

    if (line) {
      line.style.animationPlayState =
        raw >= 1 ? "paused" : "running";
    }

    // --------------------------------
    // SEE WORK
    // --------------------------------

    if (seeWork) {
      seeWork.style.opacity = String(
        1 - clamp(raw * 2, 0, 1)
      );

      seeWork.style.pointerEvents =
        raw > 0.45 ? "none" : "auto";
    }
  }

  // --------------------------------
  // PERFORMANCE
  // --------------------------------

  function requestUpdate() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  // Activate floating layout
  document.documentElement.classList.add("motion-ready");

  update();

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate);

  if (reduced.addEventListener) {
    reduced.addEventListener("change", requestUpdate);
  } else if (reduced.addListener) {
    reduced.addListener(requestUpdate);
  }

  // Recalculate when custom font has loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(requestUpdate);
  }
})();
