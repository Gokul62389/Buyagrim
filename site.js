/* Agrim homepage: hero slider, nav dropdown, mobile menu, marquee loop, scroll reveals */
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- hero slider ---- */
(() => {
  const slides = $$('.slide'), tabs = $$('.bars button'), now = $('.pager .now');
  if (slides.length < 2) return;
  let i = 0, timer = 0;
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.toggleAttribute('inert', k !== i); });
    tabs.forEach((t, k) => t.setAttribute('aria-selected', k === i));
    now.textContent = String(i + 1).padStart(2, '0');
  };
  const play = () => { clearInterval(timer); if (!reduced()) timer = setInterval(() => go(i + 1), 7000); };
  tabs.forEach((t, k) => t.addEventListener('click', () => { go(k); play(); }));
  const card = $('.hero-card');
  // the card fills the viewport, so pausing on hover would stop it almost always; pause only while keyboard focus is inside
  card.addEventListener('focusin', e => e.target.matches(':focus-visible') && clearInterval(timer));
  card.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : play());
  play();
})();

/* ---- Business dropdown ---- */
(() => {
  const btn = $('.dd > button'), menu = $('#dd-biz');
  const set = on => { btn.setAttribute('aria-expanded', on); menu.classList.toggle('open', on); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { set(false); btn.focus(); } });
})();

/* ---- mobile menu ---- */
(() => {
  const burger = $('.burger'), drawer = $('#drawer');
  const set = on => {
    burger.setAttribute('aria-expanded', on); burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    drawer.hidden = !on; document.body.classList.toggle('menu-open', on);
    if (on) $('.dr-close').focus();
  };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', e => { if (e.target.closest('a, .dr-close')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) { set(false); burger.focus(); } });
  matchMedia('(min-width:1241px)').addEventListener('change', e => e.matches && set(false));
})();

/* ---- marquee: two copies of the row so the loop is seamless ---- */
(() => {
  const row = $('.mq-row'); if (!row) return;
  const track = document.createElement('div'); track.className = 'mq-track';
  row.before(track); const copy = row.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); track.append(row, copy);
})();

/* ---- reveal on scroll + 80+ count-up ---- */
(() => {
  const groups = [['.biz .head > *', .08], ['.cat', .08], ['.ab-copy > *', .06], ['.ab-grid > *', .08], ['.svc .head > *', .08], ['.card', .08], ['.social > *', .1], ['.ct-copy > *', .06], ['.q-card', 0], ['.ft-cols > *', .06]];
  groups.forEach(([sel, step]) => $$(sel).forEach((el, k) => { el.classList.add('rv'); el.style.setProperty('--d', `${k * step}s`); }));
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - (1 - p) ** 3)) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const c = $('[data-count]', e.target); if (c && !reduced()) count(c);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));
})();

/* ---- testimonials ---- */
(() => {
  const qs = $$('.q-slides figure'); if (qs.length < 2) return;
  let i = 0;
  $$('[data-q]').forEach(b => b.addEventListener('click', () => {
    qs[i].hidden = true; qs[i].classList.remove('is-on');
    i = (i + +b.dataset.q + qs.length) % qs.length;
    qs[i].hidden = false; qs[i].classList.add('is-on');
  }));
})();
