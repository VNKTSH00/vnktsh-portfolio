// ===========================================================
// vnktsh.com — shared behaviour
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  /* Reveal-on-scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* Back to top button */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Whole-card links — cards with real interactive children (download
     buttons, an explicit "see more" link) can't be wrapped in an <a>
     without nesting anchors, so a click anywhere else on the card
     navigates instead. Clicks on an inner link/button keep their own
     destination. */
  document.querySelectorAll('[data-card-link]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      window.location.href = card.dataset.cardLink;
    });
  });

  /* Screenshot gallery — prev/next buttons and a counter over a
     scroll-snap track. The track scrolls fine on its own; this only
     adds the buttons, so they stay hidden until this runs. */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('.gallery-track');
    const slides = [...track.children];
    const controls = gallery.querySelector('.gallery-controls');
    const [prev, next] = gallery.querySelectorAll('.gallery-btn');
    const current = gallery.querySelector('[data-current]');
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const index = Math.round(track.scrollLeft / step());
      // At the far end several slides are visible at once; count the last one.
      current.textContent = track.scrollLeft >= max - 2 ? slides.length : index + 1;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };

    [prev, next].forEach((btn) =>
      btn.addEventListener('click', () =>
        track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: smooth })
      )
    );
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    controls.hidden = false;
    update();
  });

  /* Contact form — POSTs to Web3Forms, which relays it server-side to
     whichever inbox the access key is mapped to in the Web3Forms dashboard.
     The address is deliberately not named here: this file is served publicly,
     and keeping it out of the site's source is the same reason it isn't
     printed on the Contact page. No mailto: involved, so it works for any
     visitor regardless of whether they have a local email client. */
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action');

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data && data.success) {
          status.textContent = "Thanks! Your message is on its way — I'll reply soon.";
          status.className = 'form-status show ok';
          form.reset();
        } else {
          throw new Error(data?.message || 'Request failed');
        }
      } catch (err) {
        status.textContent = 'Something went wrong sending that. Try emailing me directly below.';
        status.className = 'form-status show err';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    });
  }

  /* Breeze — on a desktop with a mouse, the leaves on the vines behind the
     page rustle as the cursor passes and blow off the screen if it comes
     close, then grow back a little later.

     The vines normally live in one tiled background image, where no single
     leaf can move. So this splits the tile: the stems stay in the CSS
     background, and every leaf is redrawn as its own SVG shape at exactly
     the spot the tile would have painted it. Both layers sit behind the
     content with pointer-events: none, so no click, hover or focus on the
     page can ever land on a leaf. Wrapped so that if anything here fails,
     the page simply keeps its still leaves. */
  try {
    setUpBreeze();
  } catch (err) {
    /* The static background is already in place. */
  }
});

function setUpBreeze() {
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!desktop || still || !window.ResizeObserver) return;

  const root = document.documentElement;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const TILE = 760; // matches background-size on body and .section-alt

  // Read the vines straight out of the stylesheet, so there's one drawing.
  const raw = getComputedStyle(root).getPropertyValue('--motif-vines');
  const match = raw.match(/data:image\/svg\+xml,(.+?)["']?\)\s*$/);
  if (!match) return;
  const doc = new DOMParser().parseFromString(decodeURIComponent(match[1]), 'image/svg+xml');
  const group = doc.querySelector('g');
  if (!group) return;

  // Each leaf is an outline (M … Q … Q …) followed by its midrib (M … L …).
  // Anything else is a stem and stays in the background.
  const leaves = [];
  const paths = [...group.querySelectorAll('path')];
  for (let i = 0; i < paths.length - 1; i++) {
    const outline = paths[i].getAttribute('d');
    const rib = paths[i + 1].getAttribute('d');
    if ((outline.match(/Q/g) || []).length !== 2 || !/L/.test(rib)) continue;
    const [bx, by, tx, ty] = rib.match(/-?[\d.]+/g).map(Number);
    leaves.push({ outline, rib, bx, by, cx: (bx + tx) / 2, cy: (by + ty) / 2 });
    paths[i].remove();
    paths[i + 1].remove();
    i++;
  }
  if (!leaves.length) return;
  const stems = 'url("data:image/svg+xml,' +
    encodeURIComponent(new XMLSerializer().serializeToString(doc.documentElement)) + '")';

  const strokeAttrs = ['stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap']
    .map((a) => `${a}="${group.getAttribute(a)}"`).join(' ');
  const restOpacity = Number(group.getAttribute('stroke-opacity')) || 0.06;
  const tileMarkup =
    `<svg xmlns="${SVG_NS}" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">` +
    `<g fill="none" ${strokeAttrs}>` +
    leaves.map((l) => `<g class="leaf"><path d="${l.outline}"/><path d="${l.rib}"/></g>`).join('') +
    '</g></svg>';

  // The same leaf, redrawn around its own base for flight.
  const shift = (d, dx, dy) => {
    let n = 0;
    return d.replace(/-?[\d.]+/g, (v) => (+v - (n++ % 2 ? dy : dx)).toFixed(1));
  };
  const flightMarkup = leaves.map((l) =>
    `<svg xmlns="${SVG_NS}" width="80" height="80" viewBox="-40 -40 80 80">` +
    `<g fill="none" ${strokeAttrs.replace(/stroke-opacity="[^"]*"/, '')}>` +
    `<path d="${shift(l.outline, l.bx, l.by)}"/><path d="${shift(l.rib, l.bx, l.by)}"/></g></svg>`
  );

  const sky = document.createElement('div');
  sky.className = 'breeze-sky';
  sky.setAttribute('aria-hidden', 'true');
  document.body.appendChild(sky);

  const swaying = new Set(); // leaves rocking back to rest
  const flying = new Set();  // leaves on their way off the screen
  let grid = new Map(); // 128px buckets of live leaves, for nearby lookups
  let layers = [];
  let run = 0;          // bumps on every rebuild, so a stale one stops
  const CELL = 128;
  const idle = window.requestIdleCallback ||
    ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 16));

  // Built a few tiles at a time while the browser is idle, so opening a
  // page never waits on it. Until the last tile is in, the full vines stay
  // in the background; then stems and leaves swap in the same frame.
  const build = () => {
    const id = ++run;
    root.classList.remove('breeze');
    root.style.removeProperty('--motif-vines');
    layers.forEach((layer) => layer.remove());
    layers = [];
    grid = new Map();
    swaying.clear();

    // The page's own tiling starts at the document's top-left corner; each
    // .section-alt restarts it from its own corner, on its linen surface.
    const bodyLayer = document.createElement('div');
    bodyLayer.className = 'breeze-layer';
    const width = root.clientWidth;
    const height = root.scrollHeight;
    bodyLayer.style.width = width + 'px';
    bodyLayer.style.height = height + 'px';
    const surfaces = [{ layer: bodyLayer, parent: null, x: 0, y: 0, width, height }];
    document.querySelectorAll('.section-alt').forEach((section) => {
      const layer = document.createElement('div');
      layer.className = 'breeze-layer is-section';
      const rect = section.getBoundingClientRect();
      surfaces.push({
        layer,
        parent: section,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    });

    const tiles = [];
    surfaces.forEach((s) => {
      s.layer.setAttribute('aria-hidden', 'true');
      layers.push(s.layer);
      for (let ty = 0; ty < s.height; ty += TILE) {
        for (let tx = 0; tx < s.width; tx += TILE) tiles.push({ s, tx, ty });
      }
    });

    const nextGrid = new Map();
    const step = (deadline) => {
      if (id !== run) return;
      do {
        const { s, tx, ty } = tiles.pop();
        const holder = document.createElement('div');
        holder.innerHTML = tileMarkup;
        const svg = holder.firstChild;
        svg.style.left = tx + 'px';
        svg.style.top = ty + 'px';
        s.layer.appendChild(svg);
        svg.querySelectorAll('.leaf').forEach((el, i) => {
          const l = leaves[i];
          const leaf = {
            el, shape: i, state: 'rest', rot: 0, spin: 0,
            bx: l.bx, by: l.by,                      // base, in tile coordinates
            x: s.x + tx + l.cx, y: s.y + ty + l.cy,  // centre, in document coordinates
            baseX: s.x + tx + l.bx, baseY: s.y + ty + l.by,
          };
          const key = `${Math.floor(leaf.x / CELL)},${Math.floor(leaf.y / CELL)}`;
          if (!nextGrid.has(key)) nextGrid.set(key, []);
          nextGrid.get(key).push(leaf);
        });
      } while (tiles.length && deadline.timeRemaining() > 4);

      if (tiles.length) {
        idle(step);
        return;
      }
      // The layers are only attached now, fully drawn, as the swap happens.
      surfaces.forEach(({ layer, parent }) =>
        parent ? parent.appendChild(layer) : document.body.prepend(layer)
      );
      grid = nextGrid;
      root.style.setProperty('--motif-vines', stems);
      root.classList.add('breeze');
    };
    idle(step);
  };

  build();

  // Rebuild when the page changes shape (fonts landing, window resized).
  let lastSize = `${root.clientWidth}x${document.body.offsetHeight}`;
  let rebuildTimer;
  new ResizeObserver(() => {
    const size = `${root.clientWidth}x${document.body.offsetHeight}`;
    if (size === lastSize) return;
    lastSize = size;
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(build, 200);
  }).observe(document.body);

  // --- Motion -----------------------------------------------------------
  const RUSTLE = 150;      // px - leaves inside this sway away from the cursor
  const REGROW_MIN = 18e3; // ms before a blown leaf grows back
  const pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0, moved: false };
  let frame = 0;
  let last = 0;

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const now = e.timeStamp;
    const dt = Math.max(8, now - pointer.t) / 1000;
    if (pointer.t) {
      // Smoothed velocity, px/s - the gust grows with how fast you sweep.
      pointer.vx = pointer.vx * 0.5 + ((e.clientX - pointer.x) / dt) * 0.5;
      pointer.vy = pointer.vy * 0.5 + ((e.clientY - pointer.y) / dt) * 0.5;
    }
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.t = now;
    pointer.moved = true;
    wake();
  }, { passive: true });

  const blow = (leaf, dx, dy, dist) => {
    leaf.state = 'gone';
    leaf.el.removeAttribute('transform');
    leaf.el.classList.add('is-gone');
    swaying.delete(leaf);

    const holder = document.createElement('div');
    holder.innerHTML = flightMarkup[leaf.shape];
    const el = holder.firstChild;
    el.style.opacity = restOpacity;
    sky.appendChild(el);

    const speed = Math.min(1500, Math.hypot(pointer.vx, pointer.vy));
    const push = 420 + Math.random() * 280 + speed * 0.35;
    flying.add({
      el, leaf,
      x: leaf.baseX - window.scrollX,
      y: leaf.baseY - window.scrollY,
      vx: (dx / dist) * push + pointer.vx * 0.25,
      vy: (dy / dist) * push + pointer.vy * 0.25,
      rot: leaf.rot,
      spin: (Math.random() - 0.5) * 600,
      alpha: restOpacity,
      age: 0,
      phase: Math.random() * Math.PI * 2,
    });
  };

  const regrow = (leaf) => {
    setTimeout(() => {
      leaf.el.classList.remove('is-gone');
      leaf.state = 'rest';
    }, REGROW_MIN + Math.random() * 12e3);
  };

  function tick(now) {
    frame = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;

    if (pointer.moved) {
      pointer.moved = false;
      const px = pointer.x + window.scrollX;
      const py = pointer.y + window.scrollY;
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const reach = 45 + Math.min(speed * 0.05, 45); // a faster sweep blows wider
      const c0 = Math.floor((px - RUSTLE) / CELL);
      const c1 = Math.floor((px + RUSTLE) / CELL);
      const r0 = Math.floor((py - RUSTLE) / CELL);
      const r1 = Math.floor((py + RUSTLE) / CELL);
      for (let c = c0; c <= c1; c++) {
        for (let r = r0; r <= r1; r++) {
          const bucket = grid.get(`${c},${r}`);
          if (!bucket) continue;
          for (const leaf of bucket) {
            if (leaf.state === 'gone') continue;
            const dx = leaf.x - px;
            const dy = leaf.y - py;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < reach) {
              blow(leaf, dx, dy, dist);
            } else if (dist < RUSTLE) {
              // Turn the tip away from the cursor, harder the closer it is.
              const lx = leaf.x - leaf.baseX;
              const ly = leaf.y - leaf.baseY;
              const side = Math.sign(lx * dy - ly * dx) || 1;
              leaf.spin += side * (1 - dist / RUSTLE) * (120 + Math.min(speed, 1200) * 0.4) * dt * 8;
              swaying.add(leaf);
            }
          }
        }
      }
    }

    // Swaying leaves spring back to rest.
    for (const leaf of swaying) {
      leaf.spin += (-160 * leaf.rot - 9 * leaf.spin) * dt;
      leaf.rot = Math.max(-35, Math.min(35, leaf.rot + leaf.spin * dt));
      if (Math.abs(leaf.rot) < 0.05 && Math.abs(leaf.spin) < 0.5) {
        leaf.rot = 0;
        leaf.spin = 0;
        leaf.el.removeAttribute('transform');
        swaying.delete(leaf);
      } else {
        leaf.el.setAttribute('transform', `rotate(${leaf.rot.toFixed(2)} ${leaf.bx} ${leaf.by})`);
      }
    }

    // Blown leaves tumble on until they leave the screen.
    const w = root.clientWidth;
    const h = window.innerHeight;
    for (const f of flying) {
      f.age += dt;
      const drag = Math.pow(0.55, dt);
      f.vx *= drag;
      f.vy *= drag;
      const v = Math.hypot(f.vx, f.vy) || 1;
      if (v < 240) {
        // Never stall mid-air - the breeze keeps carrying it out.
        f.vx *= 240 / v;
        f.vy *= 240 / v;
      }
      const flutter = Math.sin(f.age * 7 + f.phase) * 260;
      f.x += (f.vx + (-f.vy / v) * flutter) * dt;
      f.y += (f.vy + (f.vx / v) * flutter + 40) * dt;
      f.rot += f.spin * dt;
      f.alpha = Math.min(0.2, f.alpha + dt * 0.45); // a touch clearer in the air
      f.el.style.opacity = f.alpha.toFixed(3);
      f.el.style.transform = `translate3d(${(f.x - 40).toFixed(1)}px, ${(f.y - 40).toFixed(1)}px, 0) rotate(${f.rot.toFixed(1)}deg)`;
      if (f.x < -60 || f.x > w + 60 || f.y < -60 || f.y > h + 60 || f.age > 10) {
        f.el.remove();
        flying.delete(f);
        regrow(f.leaf);
      }
    }

    if (swaying.size || flying.size) wake();
  }
}
