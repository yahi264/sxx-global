/* ==========================================================================
   SXX Global — gentle motion: reading progress, page curtain,
   counters and soft magnetic buttons.
   ========================================================================== */
(() => {
  const q = (s, el = document) => el.querySelector(s);
  const qa = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* page curtain (used for language switches) */
  const curtain = q('#curtain');
  function playCurtain(cb) {
    if (reduce || !curtain) { cb && cb(); return; }
    curtain.classList.remove('out'); curtain.classList.add('in');
    setTimeout(() => { cb && cb(); curtain.classList.remove('in'); curtain.classList.add('out'); setTimeout(() => curtain.classList.remove('out'), 600); }, 420);
  }

  /* reading progress */
  const bar = q('#progress');
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* counters */
  function counters() {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now();
      const step = (now) => { const k = clamp((now - t0) / 1400); el.textContent = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.4 });
    qa('[data-count]').forEach((el) => io.observe(el));
  }

  /* soft magnetic pull on key buttons */
  function magnets() {
    if (!fine || reduce) return;
    qa('.mag').forEach((el) => {
      if (el.dataset.mag) return; el.dataset.mag = 1;
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.18}px)`; });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  window.FX = { mount() { counters(); magnets(); onScroll(); }, curtain: playCurtain };
  window.FX.mount();
})();
