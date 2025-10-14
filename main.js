/* main.js - reveal, lazy-loading, filters, lightbox, contact form */
document.addEventListener('DOMContentLoaded', () => {
  const FORM_ENDPOINT = '';
  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal, .service-card, .thumb');
  if (reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) ent.target.classList.add('show');
      });
    }, {threshold: 0.12});
    reveals.forEach(r => obs.observe(r));
  }
  /* ---------- Filters (si existen en la página) ---------- */
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  if (filterBtns.length && thumbs.length) {
    function applyFilter(filter) {
      thumbs.forEach(t => {
        const cats = (t.dataset.category || '').split(/\s+/);
        if (filter === 'all' || cats.includes(filter)) {
          t.style.display = '';
          t.setAttribute('aria-hidden', 'false');
        } else {
          t.style.display = 'none';
          t.setAttribute('aria-hidden', 'true');
        }
      });
    }
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        applyFilter(filter);
        filterBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
      });
    });
    applyFilter('all');
  }
  /* ---------- Lazy-loading (IntersectionObserver) ---------- */
  const imgs = Array.from(document.querySelectorAll('.thumb-img'));
  if ('IntersectionObserver' in window && imgs.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.addEventListener('load', () => img.classList.add('loaded'));
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach(img => {
      if (img.dataset.src) io.observe(img);
      else img.classList.add('loaded');
    });
  } else {
    imgs.forEach(img => {
      if (img.dataset && img.dataset.src) img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
  /* ---------- Lightbox (global) ---------- */
  const globalThumbs = Array.from(document.querySelectorAll('.thumb'));
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  if (globalThumbs.length && lb && lbImg && lbClose) {
    let currentIndex = -1;
    function openLightboxFromIndex(i) {
      const thumb = globalThumbs[i];
      if (!thumb) return;
      const img = thumb.querySelector('img');
      const caption = thumb.querySelector('.caption')?.textContent || '';
      if (img.dataset && img.dataset.src) {
        img.src = img.dataset.src;
        img.addEventListener('load', () => {
          lbImg.src = img.src;
        }, { once: true });
      } else {
        lbImg.src = img.src;
      }
      lb.setAttribute('aria-hidden','false');
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
      currentIndex = i;
    }
    function closeLb() {
      lb.classList.remove('active');
      lb.setAttribute('aria-hidden','true');
      lbImg.src = '';
      document.body.style.overflow = '';
      currentIndex = -1;
    }
    globalThumbs.forEach((t,i) => {
      const btn = t.querySelector('.thumb-btn, button, a') || t;
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        openLightboxFromIndex(i);
      });
    });
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
  }
  /* ---------- Contact form (simple) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = new FormData(contactForm);
      if (FORM_ENDPOINT) {
        try {
          const res = await fetch(FORM_ENDPOINT, {method:'POST', body:fd});
          if (res.ok) alert('Gracias — mensaje enviado.');
          else alert('Error al enviar. Intenta por WhatsApp.');
        } catch (e) {
          alert('Error de red. Intenta por WhatsApp.');
        }
      } else {
        alert('Demo: mensaje registrado. Para enviar en producción agrega tu FORM_ENDPOINT en main.js');
      }
      contactForm.reset();
    });
  }
  /* ---------- Top button ---------- */
  const btnTop = document.getElementById('btnTop');
  if (btnTop) btnTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
});