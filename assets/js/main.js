function initScrollEffects() {
  const shade = document.getElementById("bgShade");
  const nav = document.getElementById("topLinks");
  if (!nav) return;

  const mqMobile = window.matchMedia("(max-width: 640px)");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const maxOpacity = 0.0;
  const rampPx = 220;

  let ticking = false;
  let navHidden = nav.classList.contains("hide");
  let lastShadeOpacity = null;

  function apply() {
    const y = window.scrollY || 0;
    const reducedMotion = reduceMotionQuery.matches;

    if (shade && maxOpacity > 0 && !reducedMotion) {
      const t = Math.min(1, y / rampPx);
      const newOpacity = +(t * maxOpacity).toFixed(3);
      if (lastShadeOpacity !== newOpacity) {
        shade.style.opacity = newOpacity;
        lastShadeOpacity = newOpacity;
      }
    } else if (shade) {
      if (lastShadeOpacity !== 0) {
        shade.style.opacity = "0";
        lastShadeOpacity = 0;
      }
    }

    if (mqMobile.matches) {
      if (navHidden) {
        nav.classList.remove("hide");
        navHidden = false;
      }
    } else {
      const shouldHide = y > 40;
      if (navHidden !== shouldHide) {
        nav.classList.toggle("hide", shouldHide);
        navHidden = shouldHide;
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  }

  apply();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", apply, { passive: true });
  mqMobile.addEventListener?.("change", apply);
  reduceMotionQuery.addEventListener?.("change", apply);
}

function initLogoFade() {
  const logo = document.getElementById("heroLogo");
  const hero = document.getElementById("home");
  if (!logo || !hero) return;

  requestAnimationFrame(() => {
    logo.classList.add("show");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        logo.classList.toggle("logo-hidden", !entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );

  io.observe(hero);
}

function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const scrim = document.getElementById("mobileScrim");
  if (!menuBtn || !mobileMenu || !scrim) return;

  function lockScroll(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
    document.body.style.touchAction = lock ? "none" : "";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    scrim.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    lockScroll(false);
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    scrim.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    lockScroll(true);
  }

  menuBtn.addEventListener("click", () => {
    (mobileMenu.classList.contains("open") ? closeMenu : openMenu)();
  });

  scrim.addEventListener("click", closeMenu);

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (!window.matchMedia("(max-width: 640px)").matches) {
        closeMenu();
      }
    },
    { passive: true }
  );
}

function initLazyVideo() {
  const videoWrap = document.querySelector(".video-wrap");
  if (!videoWrap) return;

  const button = videoWrap.querySelector(".video-load-btn");
  const src = videoWrap.dataset.videoSrc;
  if (!button || !src) return;

  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Dead Gravel – Ruin My Fun";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    videoWrap.appendChild(iframe);
    button.remove();
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollEffects();
  initLogoFade();
  initMobileMenu();
  setFooterYear();
  initLazyVideo();
});
