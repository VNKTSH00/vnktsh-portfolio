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

  /* Contact form (Formspree-style endpoint via fetch, no page reload) */
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action');

      // EDIT: no Formspree endpoint configured yet (see README for the
      // 2-minute setup) — fall back to opening a pre-filled email instead
      // of failing silently, so the form still reaches support@vnktsh.com.
      if (!action || action.includes('YOUR_FORM_ID')) {
        const name = form.querySelector('#name')?.value || '';
        const email = form.querySelector('#email')?.value || '';
        const reason = form.querySelector('#reason')?.value || '';
        const message = form.querySelector('#message')?.value || '';
        const subject = `Portfolio contact: ${reason || 'Message from vnktsh.com'}`;
        const body = `${message}\n\n— ${name}${email ? ` (${email})` : ''}`;
        window.location.href = `mailto:support@vnktsh.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent =
          "Opening your email app to send this to support@vnktsh.com…";
        status.className = 'form-status show ok';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          status.textContent = "Thanks! Your message is on its way — I'll reply soon.";
          status.className = 'form-status show ok';
          form.reset();
        } else {
          throw new Error('Request failed');
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
