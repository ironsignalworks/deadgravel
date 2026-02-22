import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";

const CONTACT_EMAIL = "deadgravell77@gmail.com";
const STORE_DISABLED = true;
const SITE_URL = "https://deadgravel.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/thumb.jpg`;

const routeMeta = {
  "/": {
    title: "Dead Gravel | Official Site",
    description: "Rust, ruin, and rock'n'roll. Listen to 'Ruin My Fun' and explore the world of Dead Gravel.",
    url: `${SITE_URL}/`
  },
  "/bio": {
    title: "Dead Gravel | Bio",
    description:
      "Meet Dead Gravel: lineup, artwork, and the story behind their southern gothic grit and rock'n'roll sound.",
    url: `${SITE_URL}/bio`
  },
  "/merch": {
    title: "Dead Gravel | Merch",
    description: "Official Dead Gravel merch and store updates.",
    url: `${SITE_URL}/merch`
  }
};

function normalizePath(pathname) {
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
}

function upsertMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function applyRouteMeta(pathname) {
  const normalizedPath = normalizePath(pathname);
  const meta = routeMeta[normalizedPath] ?? routeMeta["/"];
  document.title = meta.title;

  upsertMeta("name", "description", meta.description);
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:url", meta.url);
  upsertMeta("property", "og:image", DEFAULT_OG_IMAGE);
  upsertMeta("property", "og:image:alt", "Dead Gravel promotional artwork");

  upsertMeta("name", "twitter:title", meta.title);
  upsertMeta("name", "twitter:description", meta.description);
  upsertMeta("name", "twitter:url", meta.url);
  upsertMeta("name", "twitter:image", DEFAULT_OG_IMAGE);
  upsertMeta("name", "twitter:image:alt", "Dead Gravel promotional artwork");

  upsertLink("canonical", meta.url);
}

const merchProducts = [
  {
    id: "tee-dustborn",
    title: "Dustborn Shirt",
    description: "Premium cotton, unisex. Sizes S-XXL.",
    price: "EUR 21.99",
    checkoutUrl: "https://buy.stripe.com/dRm28j59dbKCdSF4wI8EM00",
    sizes: [
      { label: "S", stock: 12 },
      { label: "M", stock: 8 },
      { label: "L", stock: 0 },
      { label: "XL", stock: 6 },
      { label: "XXL", stock: 2 }
    ],
    colors: [
      { label: "Yellow", image: "/assets/images/merch1-yellow.jpeg" },
      { label: "Black", image: "/assets/images/merch1-black.jpeg" },
      { label: "White", image: "/assets/images/merch1-white.jpeg" }
    ],
    defaultColor: "Yellow"
  },
  {
    id: "totebag-classic",
    title: "Dustborn Totebag",
    description: "Sturdy cotton tote. One size.",
    price: "EUR 14.99",
    checkoutUrl: "https://buy.stripe.com/dRm28j59dbKCdSF4wI8EM00",
    sizes: [{ label: "One Size", stock: 25 }],
    colors: [
      { label: "Natural", image: "/assets/images/merch2-natural.png" },
      { label: "Black", image: "/assets/images/merch2-black.png" },
      { label: "White", image: "/assets/images/merch2-white.png" }
    ],
    defaultColor: "Natural"
  },
  {
    id: "tee-longsleeve",
    title: "Dead Gravel Longsleeve Shirt",
    description: "Soft heavyweight cotton, ribbed cuffs.",
    price: "EUR 29.99",
    checkoutUrl: "https://buy.stripe.com/dRm28j59dbKCdSF4wI8EM00",
    sizes: [
      { label: "S", stock: 0 },
      { label: "M", stock: 7 },
      { label: "L", stock: 7 },
      { label: "XL", stock: 7 },
      { label: "XXL", stock: 1 }
    ],
    colors: [
      { label: "Black", image: "/assets/images/merch3-black.jpeg" },
      { label: "White", image: "/assets/images/merch3-white.jpeg" },
      { label: "Pink", image: "/assets/images/merch3-pink.jpeg" }
    ],
    defaultColor: "Black"
  }
];

function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideDesktopNav, setHideDesktopNav] = useState(false);
  const [shadeOpacity, setShadeOpacity] = useState(0);
  const normalizedPath = useMemo(() => normalizePath(location.pathname), [location.pathname]);

  const routeClass = useMemo(() => {
    if (normalizedPath === "/bio") return "route-bio";
    if (normalizedPath === "/merch") return "route-merch";
    return "route-home";
  }, [normalizedPath]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const isHome = normalizedPath === "/";
    const maxOpacity = isHome ? 0 : 0.75;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY || 0;
      const isMobileNav = window.matchMedia("(max-width: 640px)").matches;
      const isMobileBg = window.matchMedia("(max-width: 900px)").matches;
      setHideDesktopNav(!isMobileNav && y > 40);
      if (maxOpacity === 0) {
        setShadeOpacity(0);
      } else {
        const next = Math.min(1, y / 220) * maxOpacity;
        setShadeOpacity(Number(next.toFixed(3)));
      }

      const parallaxOffset = isMobileBg ? Math.round(y * 0.28) : 0;
      document.documentElement.style.setProperty("--bg-parallax-offset", `${parallaxOffset}px`);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      document.documentElement.style.setProperty("--bg-parallax-offset", "0px");
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        window.requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    applyRouteMeta(location.pathname);
  }, [normalizedPath]);

  return (
    <div className={`site-shell ${routeClass}`}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="bg-shade" aria-hidden="true" style={{ opacity: shadeOpacity }} />

      <nav className={`top-links ${hideDesktopNav ? "hide" : ""}`} aria-label="Primary">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/bio">Bio</NavLink>
        <NavLink to="/merch">Merch</NavLink>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
      </nav>

      <button
        className="hamburger"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-controls="mobileMenu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className={`mobile-scrim ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="mobileMenu" aria-label="Mobile primary">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/bio" onClick={() => setMenuOpen(false)}>
          Bio
        </Link>
        <Link to="/merch" onClick={() => setMenuOpen(false)}>
          Merch
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => setMenuOpen(false)}>
          Contact
        </a>
      </div>

      <main id="main">
        <div className="top-pad" aria-hidden="true" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bio/*" element={<BioPage />} />
          <Route path="/merch/*" element={<MerchPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

function HomePage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [logoHidden, setLogoHidden] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setLogoHidden(!entry.isIntersecting));
      },
      { threshold: 0.3 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="home" ref={heroRef}>
        <div className="section-inner">
          <img
            src="/assets/images/logo1.svg"
            alt="Dead Gravel Logo"
            className={`hero-logo ${logoHidden ? "logo-hidden" : ""}`}
            width="1440"
            height="420"
          />
          <h2 className="tagline">Rust, Ruin, and Rock&amp;Roll</h2>
        </div>
      </section>

      <section id="news">
        <div className="section-inner">
          <article className="rundown-feature">
            <span className="rundown-accent" aria-hidden="true" />
            <h3>
              Debut Album:
              <br />
              <em>Ragged Roads &amp; Wasted Souls</em>
            </h3>
            <p>
              Dead Gravel are currently working on their first album, <strong>Ragged Roads &amp; Wasted Souls</strong> - a 12-track
              southern gothic road record steeped in grit and gasoline.
            </p>
            <p>
              From backwoods sermons to desert ghost towns, it drags the listener through the lowlands of sin and
              salvation, told through rusted guitars, slow-burn grooves, and voices that sound half-dead, half-divine.
            </p>
          </article>
        </div>
      </section>

      <section id="demo">
        <div className="section-inner grid2">
          <div>
            <img
              src="/assets/images/demo1.webp"
              alt="Dead Gravel Demo Cover"
              className="media"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="col-copy">
            <h2>New Demo Out Now</h2>
            <p>
              Hear the first cut of our upcoming demo Dustborn - raw, loud, and unvarnished. Recorded straight to the
              bone.
            </p>
            <p>
              <a className="btn" href="https://deadgravel.bandcamp.com/track/ruin-my-fun" target="_blank" rel="noreferrer">
                Listen on Bandcamp
              </a>
            </p>
          </div>
        </div>
      </section>

      <section id="video">
        <div className="section-inner">
          <h2 className="brand">"Ruin My Fun"</h2>
          <div className="quote-box" role="note" aria-label="Video description">
            <span className="quote-accent" aria-hidden="true" />
            <p className="quote">
              "Ruin My Fun," the opening track from the demo <em>Dustborn</em>, kicks down the door with a sneer and a
              smile. Loud, loose, and unapologetically alive.
            </p>
          </div>
          <div className="video-wrap">
            {videoLoaded ? (
              <iframe
                src="https://www.youtube.com/embed/XaUY1Xp0Ppc?si=gYa8MHju3BwTquNU"
                title="Dead Gravel - Ruin My Fun"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button className="video-load-btn" type="button" onClick={() => setVideoLoaded(true)}>
                <span>Play Video</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="shows">
        <div className="section-inner">
          <h2>Shows</h2>
          <p className="tagline">Coming soon.</p>
        </div>
      </section>

      <Gravilhas image="/assets/images/gravilhas2.svg" />
    </>
  );
}

function BioPage() {
  return (
    <>
      <section id="bio">
        <div className="section-inner bio-grid">
          <div className="article col-intro">
            <img src="/assets/images/logo1.svg" alt="Dead Gravel logo" className="bio-top-logo" decoding="async" />
            <div className="kicker">Where the crows circle, halleluja!</div>
            <h2 className="brand">Rust, Ruin and Rock'n'Roll</h2>
            <div className="rule" />

            <p className="lede">
              <strong>DEAD GRAVEL</strong> drags rock'n'roll through the dirt and makes it holy again. It's sweat,
              smoke, salvation, and a prayer you won't remember in the morning.
            </p>
            <p>
              <em>"Ruin My Fun,"</em> the opening track from the demo <em>Dustborn</em>, kicks down the door with a
              sneer and a smile. Loud, loose, and unapologetically alive.
            </p>
          </div>

          <div className="col-media">
            <img src="/assets/images/lineup.jpeg" alt="Dead Gravel lineup artwork" className="media lineup-media" />
            <p className="artwork-credit">
              Artwork by{" "}
              <a href="https://gataazultattoo.com" target="_blank" rel="noreferrer">
                Angie Izquierdo
              </a>
            </p>
          </div>

          <div className="article col-lineup">
            <p>
              <strong>Lineup (left-to-right):</strong>
              <br />
              J. Nash - Guitars
              <br />
              Joey Del Grave - Vocals, Harmonica
              <br />
              Layla Stone - Keyboards, Vocals
              <br />
              Dusty Reyes - Guitar
              <br />
              Victor Silver - Drums
              <br />
              Sloane Vega - Bass
            </p>
          </div>

          <div className="article col-body">
            <p>
              A five-piece storm of desert thunder and dive-bar soul, DEAD GRAVEL blends swamp and swagger into
              something born to be blasted through busted speakers.
            </p>

            <p>
              <strong>Dustborn</strong> is the sound of six outlaws with nothing to lose, howling down the highway on
              bald tires and borrowed time. With nods to Fleetwood Mac's harmony, Blue Oyster Cult's mystique, The
              Stooges' danger, and The New York Dolls' revved-up swagger, it's rock'n'roll stripped to bones, blood,
              and smoke.
            </p>
          </div>
        </div>
      </section>
      <Gravilhas image="/assets/images/gravilhas3.svg" />
    </>
  );
}

function MerchPage() {
  return (
    <>
      <section id="header">
        <div className="section-inner">
          <div className="kicker">Official Store</div>
          <h2 className="brand">Dead Gravel Merch</h2>
          <div className="rule" />
          <p className="product-desc lead">
            Welcome to the <strong>Dead Gravel</strong> store. Prices include flat-rate EU shipping. For shipping
            outside the EU, <a href={`mailto:${CONTACT_EMAIL}`}>email us</a>. Checkout uses Stripe and PayPal.
          </p>
        </div>
      </section>

      <section id="merch">
        <div className="section-inner merch-grid">
          {merchProducts.map((product) => (
            <MerchCard key={product.id} product={product} />
          ))}
        </div>

        {STORE_DISABLED && (
          <div className="section-inner coming-soon-wrap">
            <div className="coming-soon">
              <div>
                <strong>Merch Coming Soon</strong>
              </div>
              <div className="sub">
                We are polishing a few things. Check back soon or <a href={`mailto:${CONTACT_EMAIL}`}>email us</a> for
                updates.
              </div>
            </div>
          </div>
        )}
      </section>

      <Gravilhas image="/assets/images/gravilhas4.svg" />
    </>
  );
}

function MerchCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.defaultColor);
  const [selectedSize, setSelectedSize] = useState("");
  const activeColor = product.colors.find((color) => color.label === selectedColor) ?? product.colors[0];
  const disabledCheckout = STORE_DISABLED || !selectedSize;

  return (
    <article className={`product-card ${STORE_DISABLED ? "is-disabled" : ""}`}>
      <img
        src={activeColor.image}
        alt={`${product.title} - ${activeColor.label}`}
        className="product-media"
        loading="lazy"
        decoding="async"
      />

      <h3 className="product-title">{product.title}</h3>
      <p className="product-desc">{product.description}</p>
      <div className="product-price">{product.price}</div>

      <select
        className="ship-input"
        aria-label={`Choose size for ${product.title}`}
        value={selectedSize}
        onChange={(event) => setSelectedSize(event.target.value)}
        disabled={STORE_DISABLED}
      >
        <option value="" disabled>
          Select size
        </option>
        {product.sizes.map((size) => (
          <option key={size.label} value={size.label} disabled={size.stock < 1}>
            {size.stock > 0 ? `${size.label} - ${size.stock} in stock` : `${size.label} - Out of stock`}
          </option>
        ))}
      </select>

      <div className="color-inline">
        <span className="color-label-inline">Color</span>
        <div className="swatch-row-inline">
          {product.colors.map((color) => (
            <button
              key={color.label}
              type="button"
              className="swatch-btn"
              data-selected={selectedColor === color.label}
              onClick={() => setSelectedColor(color.label)}
              disabled={STORE_DISABLED}
            >
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div className="btn-row">
        {disabledCheckout ? (
          <button type="button" className="btn btn-primary" disabled>
            {STORE_DISABLED ? "Coming Soon" : "Select Size"}
          </button>
        ) : (
          <a className="btn btn-primary" href={product.checkoutUrl} target="_blank" rel="noreferrer">
            Checkout
          </a>
        )}
      </div>

      {STORE_DISABLED && (
        <div className="disabled-cover" aria-hidden="true">
          <span className="disabled-chip">Coming Soon</span>
        </div>
      )}
    </article>
  );
}

function Gravilhas({ image }) {
  return (
    <section id="gravilhas" className="link-wrap">
      <div className="section-inner">
        <img src={image} alt="gravilhas" className="gravilhas" loading="lazy" decoding="async" />
        <Link className="full-link" to={{ pathname: "/", hash: "#home" }} aria-label="Back to top" />
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="rights">Copyright {year} Dead Gravel. All rights reserved.</div>

      <div className="socials" role="list" aria-label="Social links">
        <Link role="listitem" aria-label="Back to top" to={{ pathname: "/", hash: "#home" }}>
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
          </svg>
        </Link>
        <Link role="listitem" aria-label="Back to top" to={{ pathname: "/", hash: "#home" }}>
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
            <path d="M3 17l5.5-10H21l-5.5 10H3z" fill="currentColor" />
          </svg>
        </Link>
        <Link role="listitem" aria-label="Back to top" to={{ pathname: "/", hash: "#home" }}>
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
            <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" />
            <path d="M10 9.5l5 2.5-5 2.5v-5z" fill="currentColor" />
          </svg>
        </Link>
        <Link role="listitem" aria-label="Back to top" to={{ pathname: "/", hash: "#home" }}>
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" />
            <path d="M7 10c3-.6 7-.4 10 1M7.5 13c2.6-.4 5.8-.1 8 .9M7.8 15.8c1.9-.3 3.9 0 5.6 .7" stroke="currentColor" />
          </svg>
        </Link>
      </div>

      <div className="mini-credit">
        <a href="https://ironsignalworks.com" target="_blank" rel="noreferrer">
          Site by Iron Signal Works
        </a>
      </div>
    </footer>
  );
}

export default App;
