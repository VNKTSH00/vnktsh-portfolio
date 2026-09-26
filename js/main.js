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
});
