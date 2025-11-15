function initScrollEffects() {
  const shade = document.getElementById("bgShade");
  const nav = document.getElementById("topLinks");
  if (!nav) return;

  const mqMobile = window.matchMedia("(max-width: 640px)");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const maxOpacity = 0.0;
  const rampPx = 220;

  let ticking = false;

  function apply() {
    const y = window.scrollY || 0;
    const reducedMotion = reduceMotionQuery.matches;

    if (shade && maxOpacity > 0 && !reducedMotion) {
      const t = Math.min(1, y / rampPx);
      shade.style.opacity = (t * maxOpacity).toFixed(3);
    } else if (shade) {
      shade.style.opacity = "0";
    }

    if (mqMobile.matches) {
      nav.classList.remove("hide");
    } else {
      nav.classList.toggle("hide", y > 40);
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
});
