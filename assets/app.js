/* ==========================================================================
   SXX Global — single-page app in five languages (hash routing, works from
   file:// too). Language packs load on demand from assets/lang/.
   ========================================================================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const PIC = 'assets/img/';
const VER = 2;

let lang = 'en';
try { lang = localStorage.getItem('sxx-lang') || 'en'; } catch (e) {}
const qLang = new URLSearchParams(location.search).get('lang');
if (qLang) lang = qLang;
if (!LANGS.some((l) => l.code === lang)) lang = 'en';
const P = () => PACK[lang] || PACK.en;
const u = (k) => P().ui[k] ?? PACK.en.ui[k] ?? k;
const H = () => P().home;
const SV = (id) => P().services[id];
const CM = (id) => P().comm[id];
const L = () => LANGS.find((l) => l.code === lang);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plain = (s) => String(s).replace(/<[^>]+>/g, '');
const ltr = (s) => `<bdi class="ltr">${s}</bdi>`;
function loadLang(code) {
  if (PACK[code]) return Promise.resolve();
  return new Promise((ok, no) => { const s = document.createElement('script'); s.src = `assets/lang/${code}.js?v=${VER}`; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
}

/* ---------------- Icons ---------------- */
const I = {
  arrow: '<svg class="ar" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 22s8-7.4 8-13a8 8 0 0 0-16 0c0 5.6 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  gauge: '<svg viewBox="0 0 24 24"><path d="M12 14l4-5"/><path d="M3.3 17a10 10 0 1 1 17.4 0"/><circle cx="12" cy="14" r="1.5"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  ai: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  beam: '<svg viewBox="0 0 24 24"><path d="M3 4h18M3 20h18M12 4v16M8 4v2M16 4v2M8 18v2M16 18v2"/></svg>',
  frame: '<svg viewBox="0 0 24 24"><path d="M4 21V9l8-6 8 6v12M4 9h16M4 21h16M8 21V9M16 21V9M4 15h16"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/></svg>',
  hammer: '<svg viewBox="0 0 24 24"><path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6M20.9 11.7l-6.6-6.6a3 3 0 0 0-4.2 0L8 7.2l7.8 7.8z"/></svg>',
  drop: '<svg viewBox="0 0 24 24"><path d="M12 2.7s7 7.5 7 12.3a7 7 0 0 1-14 0c0-4.8 7-12.3 7-12.3z"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.5 1.3 2.8 2.5 2.8z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>',
  factory: '<svg viewBox="0 0 24 24"><path d="M2 20V9l6 4V9l6 4V5h4l2 15zM2 20h20M6 17h2M11 17h2M16 17h2"/></svg>',
  tank: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="7"/><path d="M5 10h14M5 14h14M9 21v1M15 21v1"/></svg>',
  train: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-2-4M15 21l2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>',
  wave: '<svg viewBox="0 0 24 24"><path d="M2 12h2l2-6 3 12 3-9 3 6 2-3h5"/></svg>',
  brush: '<svg viewBox="0 0 24 24"><path d="M9.1 14.9 3 21M14 4l6 6-8.5 8.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2z"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" class="f"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" class="f"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
};
const LOGO = `<svg class="logo-svg" viewBox="0 0 236 48" role="img" aria-label="${CO.name}">
  <path class="lg-hex" d="M24 2l20 11.5v23L24 46 4 36.5v-23z"/><path class="lg-bolt" d="M15 24.5l6 6 12-13"/><circle class="lg-dot" cx="36" cy="35" r="4"/>
  <text x="56" y="25" class="lg-word">SXX GLOBAL</text><text x="57" y="39" class="lg-sub">SOURCING · EXPEDITING · INSPECTION</text></svg>`;

/* ---------------- Shared pieces ---------------- */
function pageHead(title, crumbs = [], lead = '', kicker = '', img = '') {
  const bc = [[u('home'), '#/'], ...crumbs].map(([n, h], i, a) => (i < a.length - 1 && h ? `<a href="${h}">${esc(plain(n))}</a>` : `<span>${esc(plain(n))}</span>`)).join('<i>/</i>');
  return `<section class="phead ${img ? 'has-img' : ''}"><span class="grid-bg"></span><div class="wrap"><div><nav class="crumbs">${bc}</nav>${kicker ? `<span class="kicker">${kicker}</span>` : ''}<h1>${title}</h1>${lead ? `<p>${lead}</p>` : ''}</div>${img ? `<div class="phead-img fx-up" style="--d:.15s"><img src="${PIC + img}" alt=""></div>` : ''}</div></section>`;
}
const sec = (k, t, p, cls = '') => `<div class="sec-head ${cls} rv"><span class="kicker">${k}</span><h2>${t}</h2>${p ? `<p>${p}</p>` : ''}</div>`;
const commCard = (c) => `<a class="svc rv" href="#/commodity/${c.id}"><span class="svc-img"><img src="${PIC + c.img}" alt="" loading="lazy"><span class="svc-grp">${u('commodities')}</span><span class="svc-star">${I[c.icon]}</span></span>
  <span class="svc-body"><h3>${CM(c.id).t}</h3><p>${CM(c.id).s}</p><span class="svc-more">${u('readMore')} ${I.arrow}</span></span></a>`;
const svcCard = (s) => `<a class="s3 rv" href="#/${s.id}"><span class="s3-img"><img src="${PIC + s.img}" alt="" loading="lazy"><span class="s3-ico">${I[s.icon]}</span></span>
  <span class="s3-body"><h3>${SV(s.id).t}</h3><p>${SV(s.id).s}</p><ul>${SV(s.id).list.slice(0, 3).map(([t]) => `<li>${I.check}<span>${t}</span></li>`).join('')}</ul><span class="svc-more">${u('readMore')} ${I.arrow}</span></span></a>`;
const sectorTile = (s) => `<div class="sector rv"><img src="${PIC + s.img}" alt="" loading="lazy"><div><h3>${I[s.icon]} ${P().sectors[s.id][0]}</h3><p>${P().sectors[s.id][1]}</p></div></div>`;
const cta = () => { const c = H().cta; return `<section class="cta"><div class="cta-bg"><img src="${PIC}ship.jpg" alt="" loading="lazy"></div><div class="wrap"><div class="cta-in rv"><span class="kicker" style="color:var(--gold-2)">${u('rfq')}</span><h2>${c[0]}</h2><p>${c[1]}</p>
  <div class="acts"><a class="btn btn-gold mag" href="#/rfq">${I.doc} ${c[2]}</a><a class="btn btn-line" href="${CO.whatsapp}" target="_blank" rel="noopener">${I.whatsapp} WhatsApp</a></div></div></div></section>`; };
const tagsFor = (list) => `<div class="tags">${list.map((id) => `<span class="tag">${I[SERVICES.find((s) => s.id === id).icon]} ${SV(id).t}</span>`).join('')}</div>`;

/* ==========================================================================
   Pages
   ========================================================================== */
const ROUTES = {
  '': home,
  sourcing: () => servicePage('sourcing'),
  expediting: () => servicePage('expediting'),
  inspection: () => servicePage('inspection'),
  commodity: (q, id) => commodityPage(id),
  sectors: sectorsPage,
  about: aboutPage,
  contact: contactPage,
  rfq: rfqPage,
};
const WHY_ICONS = ['clock', 'users', 'gauge', 'shield', 'doc', 'globe'];
const SLIDES = [['hero-weld.jpg', () => CM('heavy').t], ['forging.jpg', () => CM('forging').t], ['machining.jpg', () => CM('machining').t], ['sourcing.jpg', () => SV('sourcing').t], ['inspection.jpg', () => SV('inspection').t]];

/* crossing marquee ribbons built from the pack's own titles */
function marquee() {
  const r1 = [...COMMODITIES.map((c) => CM(c.id).t), ...SERVICES.map((x) => SV(x.id).t)];
  const r2 = [...SECTORS.map((x) => P().sectors[x.id][0]), ...NDT.map((k) => P().ndt[k][0])];
  const row = (items, rev) => `<div class="mq-row ${rev ? 'rev' : ''}"><div class="mq-track">${[...items, ...items].map((t, i) => `<span class="${i % 2 ? 'o' : ''}" dir="auto">${t}</span><i>✦</i>`).join('')}</div></div>`;
  return `<section class="mq" aria-hidden="true">${row(r1)}${row(r2, true)}</section>`;
}

/* global reach: dotted world map (equirectangular, lon -170..190) with routes from Türkiye */
const MW = 1000;
const proj = ([lon, lat]) => [((lon + 170) / 360) * MW, ((80 - lat) / 360) * MW];
const ORIGIN = [35, 39];
const REGIONS = [{ p: [9, 50], l: 'l' }, { p: [47, 24], l: 'b' }, { p: [17, 4], l: 'b' }, { p: [67, 44], l: 'r' }, { p: [-92, 38], l: 'b' }];
const arcPath = (a, b) => { const [x1, y1] = proj(a), [x2, y2] = proj(b), d = Math.hypot(x2 - x1, y2 - y1); return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2 - d * 0.35).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`; };
let DOTS = '';
function reachMap() {
  if (!DOTS && typeof WORLD_DOTS !== 'undefined') DOTS = WORLD_DOTS.map((p) => { const [x, y] = proj(p); return `<circle class="wdot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.3"/>`; }).join('');
  const R = H().reach, [ox, oy] = proj(ORIGIN);
  const lbl = (t, x, y, l) => { const o = { r: [9, 4, 'start'], l: [-9, 4, 'end'], b: [0, 18, 'middle'] }[l]; return `<text x="${(x + o[0]).toFixed(1)}" y="${(y + o[1]).toFixed(1)}" text-anchor="${o[2]}">${esc(t)}</text>`; };
  return `<svg viewBox="150 40 640 250" aria-hidden="true">${DOTS}
    ${REGIONS.map((r, i) => `<path id="rt${i}" class="route" style="--dl:${(0.3 + i * 0.25).toFixed(2)}s" d="${arcPath(ORIGIN, r.p)}"/>`).join('')}
    ${REGIONS.map((r, i) => { const [x, y] = proj(r.p); return `<g class="mk" style="--dl:${(i * 0.3).toFixed(1)}s"><circle class="h" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/><circle class="d" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>${lbl(R[3][i], x, y, r.l)}</g>`; }).join('')}
    <g class="mk origin"><circle class="h" cx="${ox}" cy="${oy}" r="6"/><circle class="d" cx="${ox}" cy="${oy}" r="4.5"/>${lbl(R[4], ox, oy - 26, 'b')}</g>
    ${REGIONS.map((r, i) => `<circle class="cargo" r="2.6"><animateMotion dur="${(3.4 + i * 0.5).toFixed(1)}s" begin="${(2.4 + i * 0.4).toFixed(1)}s" repeatCount="indefinite" rotate="auto"><mpath href="#rt${i}"/></animateMotion></circle>`).join('')}</svg>`;
}
const reachSection = () => { const R = H().reach; return `<section class="sec reach"><div class="wrap reach-in"><div>${sec(R[0], R[1], R[2])}<div class="reach-list rv">${R[3].map((t) => `<span><i></i>${t}</span>`).join('')}</div>
  <div class="acts rv" style="margin-top:1.6rem"><a class="btn btn-gold" href="#/rfq">${I.doc} ${u('rfq')}</a></div></div><div class="rmap rv">${reachMap()}</div></div></section>`; };

function home() {
  const h = H();
  return `
  <section class="cine" id="cine">
    <div class="cine-media" id="cineMedia">${SLIDES.map(([img], i) => `<div class="cs${i ? '' : ' on'}"><img src="${PIC + img}" alt="" ${i ? 'loading="lazy"' : ''}></div>`).join('')}<canvas id="sparks" aria-hidden="true"></canvas></div>
    <div class="cine-shade"></div>
    <div class="wrap cine-in" id="cineIn">
      <div>
        <span class="kicker fx-up" style="--d:.15s">${h.kicker}</span>
        <h1 class="wsplit">${h.h1}</h1>
        <p class="lead fx-up" style="--d:.8s">${h.lead}</p>
        <div class="acts fx-up" style="--d:.95s"><a class="btn btn-gold mag" href="#/rfq">${I.doc} ${h.cta1}</a><a class="btn btn-glass" href="#/#services">${h.cta2} ${I.arrow}</a></div>
        <div class="rot fx-up" style="--d:1.1s"><span class="rot-ico">${I.factory}</span><span class="rot-win"><span class="rot-list" id="rotList">${[...SECTORS, SECTORS[0]].map((x) => `<b>${P().sectors[x.id][0]}</b>`).join('')}</span></span></div>
      </div>
      <div class="cine-side fx-up" style="--d:1.2s">
        <div class="hud" aria-hidden="true"><div class="hud-top"><b>${CM('heavy').t}</b><span>${u('step')} ${ltr('5/8')}</span></div>
          <div class="hud-bar">${JOURNEY.map((j, k) => `<i style="--k:${k}" class="${k === 4 ? 'cur' : k > 4 ? 'todo' : ''}"></i>`).join('')}</div>
          <div class="hud-st"><i class="dot"></i>${P().journey.fab[0]} · ${I.check}<small>${u('sample')}</small></div></div>
        <button class="hero-ai glass" data-ai><span class="ai-av">${I.ai}</span><span><b>${h.ai[0]} <em>24/7</em></b><small>${h.ai[1]}</small></span>${I.arrow}</button>
      </div>
    </div>
    <div class="wrap cine-pager" id="cinePager">${SLIDES.map(([, t], i) => `<button type="button" data-slide="${i}" class="${i ? '' : 'on'}"><i></i><b>${ltr('0' + (i + 1))}</b><span>${t()}</span></button>`).join('')}</div>
    <a class="scroll-cue" href="#/#services"><span></span>${u('scroll')}</a>
  </section>
  <section class="kpi-band"><div class="wrap"><div class="kpis">${h.stats.map(([n, s, l], i) => `<div class="rv"><span class="kpi-ico">${I[['clock', 'layers', 'box', 'factory'][i]]}</span><b><span data-count="${n}">0</span><small>${s}</small></b><span>${l}</span><i class="kpi-bar"></i></div>`).join('')}</div></div></section>
  ${marquee()}

  <section class="sec" id="services"><div class="wrap">${sec(h.svc[0], h.svc[1], h.svc[2])}<div class="svc3">${SERVICES.map(svcCard).join('')}</div></div></section>

  <section class="sec alt" id="journey"><div class="wrap">${sec(h.journey[0], h.journey[1], h.journey[2])}${journeyTool()}</div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head row rv"><div><span class="kicker">${h.comm[0]}</span><h2>${h.comm[1]}</h2><p>${h.comm[2]}</p></div><a class="btn btn-ghost" href="#/sourcing">${u('sourcing')} ${I.arrow}</a></div>
    <div class="svc-grid">${COMMODITIES.map(commCard).join('')}</div>
  </div></section>

  <section class="sec plum"><span class="grid-bg"></span><div class="wrap">
    ${sec(h.why[0], h.why[1], '', 'center')}
    <div class="why">${h.why[2].map(([t, p], i) => `<div class="rv"><span class="ico">${I[WHY_ICONS[i]]}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head row rv"><div><span class="kicker">${h.sectors[0]}</span><h2>${h.sectors[1]}</h2><p>${h.sectors[2]}</p></div><a class="btn btn-ghost" href="#/sectors">${u('sectors')} ${I.arrow}</a></div>
    <div class="sectors">${SECTORS.map(sectorTile).join('')}</div>
  </div></section>

  ${reachSection()}

  <section class="sec alt" id="ndt"><div class="wrap">${ndtTool()}</div></section>
  ${cta()}`;
}

/* ---------------- Order journey ---------------- */
let jnCur = 4;
function journeyTool() {
  return `<div class="journey rv" id="jnTool"><div class="jn-track"><span class="jn-fill" id="jnFill"></span>${JOURNEY.map((j, k) => `<button type="button" data-jn="${k}"><span>${I[j.icon]}</span>${P().journey[j.id][0]}</button>`).join('')}</div>
    <div class="jn-panel" id="jnPanel"></div><div class="jn-auto" id="jnAuto"><i></i></div></div>`;
}
function renderJourney() {
  const box = $('#jnPanel'); if (!box) return;
  const j = JOURNEY[jnCur], [t, p] = P().journey[j.id];
  $$('[data-jn]').forEach((b, k) => { b.classList.toggle('on', k === jnCur); b.classList.toggle('done', k < jnCur); });
  const fill = $('#jnFill'); if (fill) fill.style.width = `${(jnCur / (JOURNEY.length - 1)) * 88}%`;
  box.innerHTML = `<span class="jn-num">${ltr(String(jnCur + 1).padStart(2, '0'))}</span><div><h3>${t}</h3><p>${p}</p></div>${tagsFor(j.s)}`;
}

/* ---------------- NDT explorer ---------------- */
let ndtCur = 'ut';
const NDT_SVG = {
  ut: `<rect class="plate" x="40" y="120" width="420" height="110" rx="6"/><ellipse class="flaw" cx="300" cy="190" rx="26" ry="9"/><rect class="probe" x="230" y="92" width="44" height="28" rx="6"/>
    <path class="wave" d="M252 122 L298 180"/><path class="wave" d="M298 180 L330 122" style="animation-delay:-.6s"/>
    <path class="scan" d="M60 60h80l8-26 6 52 6-26h60l10-40 8 70 6-30h120"/><text class="lbl" x="40" y="105">UT · A-scan</text>`,
  rt: `<circle class="src" cx="250" cy="40" r="12"/>${[150, 200, 250, 300, 350].map((x) => `<line class="ray" x1="250" y1="52" x2="${x}" y2="210"/>`).join('')}
    <rect class="plate" x="110" y="110" width="280" height="60" rx="6"/><rect class="weld" x="225" y="110" width="50" height="60"/><circle class="flaw" cx="262" cy="140" r="8"/>
    <rect class="film" x="90" y="210" width="320" height="26" rx="4"/><circle class="shadow" cx="270" cy="223" r="7"/><text class="lbl" x="90" y="258">RT · film</text>`,
  mt: `<rect class="plate" x="40" y="130" width="420" height="90" rx="6"/><path d="M40 130h420" stroke="#9fd0ff" stroke-width="2"/><path class="flaw" d="M250 130 l10 26 -8 12 10 22" fill="none"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<circle class="part" cx="${238 + (k % 3) * 10}" cy="${118 + Math.floor(k / 3) * 6}" r="3.5" style="animation-delay:-${k * 0.25}s"/>`).join('')}
    <path d="M80 70 h340" stroke="#e8622a" stroke-width="10" stroke-linecap="round"/><path d="M80 70v58M420 70v58" stroke="#e8622a" stroke-width="10" stroke-linecap="round"/><text class="lbl" x="40" y="250">MT · yoke</text>`,
  pt: `<rect class="plate" x="40" y="130" width="420" height="90" rx="6"/><rect class="dev" x="40" y="118" width="420" height="12" rx="4"/><path class="dye" d="M246 130 l12 30 -6 10 4 18 -10 0 4 -18 -8 -10z"/>
    <ellipse class="dye" cx="250" cy="120" rx="22" ry="7" opacity=".85"/><text class="lbl" x="40" y="250">PT · red dye / white developer</text>`,
};
function ndtTool() {
  const T = P().ndtT;
  return `<div class="ndt"><div class="ndt-viz rv"><svg viewBox="0 0 500 270" id="ndtViz" aria-hidden="true"></svg></div>
    <div class="ndt-txt">${sec(T[0], T[1], T[2])}<div class="seg rv">${NDT.map((k) => `<button type="button" data-ndt="${k}" class="${k === ndtCur ? 'on' : ''}">${k.toUpperCase()}</button>`).join('')}</div><div class="rv" id="ndtTxt"></div>
    <div class="acts rv"><a class="btn btn-plum" href="#/inspection">${u('inspection')} ${I.arrow}</a></div></div></div>`;
}
function renderNdt() {
  const v = $('#ndtViz'); if (!v) return;
  v.innerHTML = NDT_SVG[ndtCur];
  const [t, p] = P().ndt[ndtCur];
  $('#ndtTxt').innerHTML = `<h3>${t}</h3><p class="muted">${p}</p>`;
  $$('[data-ndt]').forEach((b) => b.classList.toggle('on', b.dataset.ndt === ndtCur));
}

/* ---------------- Service & commodity pages ---------------- */
function servicePage(id) {
  const T = SV(id), s = SERVICES.find((x) => x.id === id);
  let body = `<p class="lead-p rv">${T.i}</p><h2 class="rv">${u('points')}</h2><div class="list7">${T.list.map(([t, p], i) => `<div class="rv"><b>${ltr(String(i + 1).padStart(2, '0'))}</b><div><h3>${t}</h3><p>${p}</p></div></div>`).join('')}</div>`;
  const ask = { en: `Tell me about ${T.t}`, tr: `${T.t} hakkında bilgi`, de: `Mehr über ${T.t}`, fr: `Parlez-moi de : ${T.t}`, ar: `حدثني عن ${T.t}` }[lang];
  let extra = '';
  if (id === 'sourcing') extra = `<section class="sec alt"><div class="wrap">${sec(H().comm[0], H().comm[1], H().comm[2])}<div class="svc-grid">${COMMODITIES.map(commCard).join('')}</div></div></section>`;
  if (id === 'expediting') extra = `<section class="sec alt" id="journey"><div class="wrap">${sec(H().journey[0], H().journey[1], H().journey[2])}${journeyTool()}</div></section>`;
  if (id === 'inspection') extra = `<section class="sec alt" id="ndt"><div class="wrap">${ndtTool()}</div></section><section class="sec" id="journey"><div class="wrap">${sec(H().journey[0], H().journey[1], H().journey[2])}${journeyTool()}</div></section>`;
  return pageHead(T.t, [[u('services'), '#/#services'], [T.t]], T.s, u('services'), s.img) +
    `<section class="sec"><div class="wrap detail"><div class="prose">${body}</div>
      <aside class="side"><div class="side-card plum rv"><h4>${H().cta[0]}</h4><p>${H().cta[1]}</p><a class="btn btn-gold full" href="#/rfq">${I.doc} ${u('rfq')}</a></div>
      <div class="side-card rv"><h4>${u('askAI')}</h4><button class="btn btn-ghost full" data-ai="${esc(ask)}">${I.ai} ${u('askAI')}</button></div>
      <div class="side-card rv"><h4>${u('services')}</h4><div class="side-links">${SERVICES.filter((x) => x.id !== id).map((x) => `<a href="#/${x.id}"><span>${I[x.icon]}</span>${SV(x.id).t}</a>`).join('')}<a href="#/sectors"><span>${I.factory}</span>${u('sectors')}</a></div></div></aside></div></section>${extra}${cta()}`;
}
const ents = (rows, two) => `<div class="ents ${two ? 'two' : ''}">${rows.map(([t, p, chips]) => `<div class="ent rv"><h3>${I.check}${t}</h3>${p ? `<p>${p}</p>` : ''}${chips ? `<div class="tags">${chips.map((c) => `<span class="tag">${c}</span>`).join('')}</div>` : ''}</div>`).join('')}</div>`;
function commodityPage(id) {
  const c = COMMODITIES.find((x) => x.id === id); if (!c) return notFound();
  const T = CM(id);
  let body = `<p class="lead-p rv">${T.i}</p><h2 class="rv">${T.a[0]}</h2>${ents(T.a[1], T.a[1].length > 3)}`;
  if (T.b) body += `<h2 class="rv">${T.b[0]}</h2>${ents(T.b[1])}`;
  const ask = { en: `Tell me about ${T.t}`, tr: `${T.t} hakkında bilgi`, de: `Mehr über ${T.t}`, fr: `Parlez-moi de : ${T.t}`, ar: `حدثني عن ${T.t}` }[lang];
  return pageHead(T.t, [[u('sourcing'), '#/sourcing'], [T.t]], T.s, u('commodities'), c.img) +
    `<section class="sec"><div class="wrap detail"><div class="prose">${body}</div>
      <aside class="side"><div class="side-card plum rv"><h4>${H().cta[0]}</h4><p>${H().cta[1]}</p><a class="btn btn-gold full" href="#/rfq?c=${id}">${I.doc} ${u('rfq')}</a></div>
      <div class="side-card rv"><h4>${u('askAI')}</h4><button class="btn btn-ghost full" data-ai="${esc(ask)}">${I.ai} ${u('askAI')}</button></div>
      <div class="side-card rv"><h4>${u('related')}</h4><div class="side-links">${COMMODITIES.filter((x) => x !== c).map((x) => `<a href="#/commodity/${x.id}"><span>${I[x.icon]}</span>${CM(x.id).t}</a>`).join('')}</div></div></aside></div></section>
    <section class="sec alt" id="journey"><div class="wrap">${sec(H().journey[0], H().journey[1], H().journey[2])}${journeyTool()}</div></section>${cta()}`;
}
function sectorsPage() {
  const h = H();
  return pageHead(h.sectors[1], [[u('sectors')]], h.sectors[2], h.sectors[0], 'energy.jpg') +
    `<section class="sec"><div class="wrap"><div class="sectors">${SECTORS.map(sectorTile).join('')}</div></div></section>
    <section class="sec alt"><div class="wrap">${sec(h.comm[0], h.comm[1], h.comm[2])}<div class="svc-grid">${COMMODITIES.map(commCard).join('')}</div></div></section>${cta()}`;
}
function aboutPage() {
  const A = P().about, h = H();
  return pageHead(A.t, [[u('about')]], A.lead, A.k, 'about.jpg') +
    `<section class="sec"><div class="wrap split" style="align-items:start"><div class="photo tall arch rv"><img src="${PIC}workshop.jpg" alt="" loading="lazy"></div>
      <div class="prose"><p class="lead-p rv">${A.story[0]}</p>${A.story.slice(1).map((p) => `<p class="rv">${p}</p>`).join('')}<div class="quote rv">${A.quote}</div>
      <div class="acts rv" style="margin-top:1.6rem"><a class="btn btn-plum" href="#/rfq">${I.doc} ${u('rfq')}</a><a class="btn btn-ghost" href="#/contact">${u('contact')}</a></div></div></div></section>
    <section class="sec plum"><span class="grid-bg"></span><div class="wrap"><div class="values4">${A.values.map(([t, p], i) => `<div class="rv"><b>${ltr('0' + (i + 1))}</b><h3>${t}</h3><p>${p}</p></div>`).join('')}</div></div></section>
    <section class="sec"><div class="wrap">${sec(h.why[0], h.why[1], '', 'center')}<div class="svc3">${SERVICES.map(svcCard).join('')}</div></div></section>${cta()}`;
}
function contactPage() {
  const f = (k, type = 'text', req, full) => `<label class="${full ? 'full' : ''}">${u(k)}${req ? ' *' : ''}<input id="c-${k}" type="${type}" ${req ? 'required' : ''} ${type === 'tel' || type === 'email' ? 'dir="ltr"' : ''}></label>`;
  return pageHead(u('contactTitle'), [[u('contact')]], u('contactLead')) +
    `<section class="sec"><div class="wrap contact"><div>
      <div class="cinfo rv">
        <a class="ci" href="${CO.whatsapp}" target="_blank" rel="noopener"><span>${I.whatsapp}</span><small>${u('waL')}</small><p>${ltr(CO.phone)}</p></a>
        <a class="ci" href="${CO.phoneHref}"><span>${I.phone}</span><small>${u('phoneL')}</small><p>${ltr(CO.phone)}</p></a>
        <a class="ci" href="mailto:${CO.email}"><span>${I.mail}</span><small>${u('emailL')}</small><p>${CO.email}</p></a>
        <div class="ci"><span>${I.clock}</span><small>${u('hoursL')}</small><p>${u('hours')}</p></div>
        <a class="ci wide" href="${CO.social.linkedin}" target="_blank" rel="noopener"><span>${I.linkedin}</span><small>LinkedIn</small><p>${CO.name}</p></a>
      </div>
      <div class="photo rv" style="margin-top:1rem;aspect-ratio:16/10"><img src="${PIC}engineer.jpg" alt="" loading="lazy" style="object-position:50% 30%"></div></div>
      <form class="frm rv" id="fContact" novalidate><h3>${u('contact')}</h3><div class="frm-grid">
        ${f('name', 'text', 1)}${f('company')}${f('email', 'email', 1)}${f('phone', 'tel')}${f('country', 'text', 0, 1)}
        <label class="full">${u('message')} *<textarea id="c-message" rows="5" required></textarea></label>
        <label class="consent full"><input type="checkbox" id="c-consent" required><span>${u('consent')}</span></label>
      </div><button class="btn btn-plum full" type="submit">${u('send')} ${I.arrow}</button><p class="frm-msg" role="status"></p>
      <div class="acts" style="margin-top:1rem"><a class="btn btn-ghost" href="#/rfq">${I.doc} ${u('rfq')}</a></div></form>
    </div></section>`;
}

/* ---------------- RFQ builder ---------------- */
const rq = { c: '', mat: 0, qty: '', date: '', sector: '', x: new Set(), lv: 'witness' };
function rfqPage(q) {
  const R = P().rfq;
  if (q.get('c') && COMMODITIES.some((c) => c.id === q.get('c'))) rq.c = q.get('c');
  const f = (k, type = 'text', req) => `<label>${u(k)}${req ? ' *' : ''}<input id="r-${k}" type="${type}" ${req ? 'required' : ''} ${type === 'tel' || type === 'email' ? 'dir="ltr"' : ''}></label>`;
  return pageHead(R.t, [[u('rfq')]], R.lead, u('rfq'), 'heavy.jpg') +
    `<section class="sec"><div class="wrap rfq" id="rfqTool"><div>
      <div class="rstep rv"><h3><b>1</b>${R.s1}</h3><div class="picks">${COMMODITIES.map((c) => `<button type="button" data-rc="${c.id}" class="${rq.c === c.id ? 'on' : ''}">${I[c.icon]} ${CM(c.id).t}</button>`).join('')}</div></div>
      <div class="rstep rv"><h3><b>2</b>${R.s2}</h3><div class="rgrid">
        <label>${R.material}<select id="r-mat">${R.materials.map((m, i) => `<option value="${i}" ${+rq.mat === i ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
        <label>${R.sector}<select id="r-sector"><option value="">—</option>${SECTORS.map((s) => `<option value="${s.id}" ${rq.sector === s.id ? 'selected' : ''}>${P().sectors[s.id][0]}</option>`).join('')}</select></label>
        <label>${R.qty}<input id="r-qty" value="${esc(rq.qty)}" placeholder="12 t"></label>
        <label>${R.date}<input id="r-date" type="date" value="${rq.date}"></label>
        <div class="full"><span style="display:block;font-size:.84rem;color:var(--muted);font-weight:700;margin-bottom:.4rem">${R.extras}</span><div class="picks">${RFQ.extras.map((k) => `<button type="button" data-rx="${k}" class="${rq.x.has(k) ? 'on' : ''}">${I.plus} ${R.x[k]}</button>`).join('')}</div></div>
      </div></div>
      <div class="rstep rv"><h3><b>3</b>${R.s3}</h3><div class="lvls">${RFQ.levels.map((k) => `<button type="button" data-rl="${k}" class="${rq.lv === k ? 'on' : ''}"><b>${R.lv[k][0]}</b><small>${R.lv[k][1]}</small></button>`).join('')}</div></div>
      <form class="rstep frm rv" id="fRfq" novalidate><h3><b>4</b>${R.s4}</h3><div class="frm-grid">
        ${f('name', 'text', 1)}${f('company', 'text', 1)}${f('email', 'email', 1)}${f('phone', 'tel')}
        <label class="full">${u('country')}<input id="r-country"></label>
        <label class="full">${u('message')}<textarea id="r-message" rows="3"></textarea></label>
        <label class="consent full"><input type="checkbox" id="r-consent" required><span>${u('consent')}</span></label></div>
        <button class="btn btn-plum full" type="submit">${u('send')} ${I.arrow}</button><p class="frm-msg" role="status"></p></form>
    </div>
    <aside><div class="card plum rsum rv" id="rSum"></div><p class="small muted rv" style="margin-top:1rem">${I.info} ${R.attach}</p></aside></div></section>`;
}
function rfqLines(extra = []) {
  const R = P().rfq, v = (x) => x || R.none;
  return [[R.s1, rq.c && CM(rq.c).t], [R.material, R.materials[rq.mat]], [R.qty, rq.qty], [R.date, rq.date && new Date(rq.date + 'T12:00:00').toLocaleDateString(L().intl, { day: 'numeric', month: 'long', year: 'numeric' })],
    [R.sector, rq.sector && P().sectors[rq.sector][0]], [R.extras, [...rq.x].map((k) => R.x[k]).join(', ')], [R.s3, R.lv[rq.lv][0]], ...extra].map(([k, x]) => [k, v(x)]);
}
const rfqText = (extra) => [plain(P().rfq.t).toUpperCase(), ...rfqLines(extra).map(([k, x]) => `${k}: ${x}`)].join('\n');
const mailHref = (txt) => `mailto:${CO.email}?subject=${encodeURIComponent(`${u('rfq')} – ${rq.c ? CM(rq.c).t : CO.name}`)}&body=${encodeURIComponent(txt)}`;
function renderRfqSum() {
  const box = $('#rSum'); if (!box) return;
  const icons = ['box', 'layers', 'gauge', 'cal', 'factory', 'plus', 'shield'];
  box.innerHTML = `<span class="kicker" style="color:var(--gold-2);margin:0">${P().rfq.summary}</span><h3>${CO.name}</h3>
    ${rfqLines().map(([k, x], i) => `<div class="rsum-row">${I[icons[i]]}<span>${k}</span><b>${esc(x)}</b></div>`).join('')}
    <div class="acts"><a class="btn btn-gold full" href="${mailHref(rfqText())}">${I.mail} ${u('sendMail')}</a><a class="btn btn-line full" href="${CO.whatsapp}?text=${encodeURIComponent(rfqText())}" target="_blank" rel="noopener">${I.whatsapp} ${u('sendWa')}</a></div>`;
}
const notFound = () => pageHead('404', [['404']]) + `<section class="sec"><div class="wrap center"><a class="btn btn-plum" href="#/">${u('home')}</a></div></section>`;

/* ==========================================================================
   Chrome
   ========================================================================== */
function renderChrome() {
  document.documentElement.lang = lang;
  document.documentElement.dir = L().dir;
  $('#logo').innerHTML = LOGO; if ($('#introMark')) $('#introMark').innerHTML = LOGO;
  $('#topbar').innerHTML = `<div class="wrap"><a href="${CO.phoneHref}">${I.phone}${ltr(CO.phone)}</a><a class="tb-mail" href="mailto:${CO.email}">${I.mail}${CO.email}</a><span class="tb-hours">${I.clock}${u('hours')}</span><span class="tb-langs">${LANGS.map((l) => `<button type="button" data-lang="${l.code}" class="${l.code === lang ? 'on' : ''}" lang="${l.code}">${l.code.toUpperCase()}</button>`).join('')}</span></div>`;
  $('#nav').innerHTML = [['', 'home'], ['sourcing', 'sourcing', 'commodity'], ['expediting', 'expediting'], ['inspection', 'inspection'], ['sectors', 'sectors'], ['about', 'about'], ['contact', 'contact']]
    .map(([r, k, also]) => `<a href="#/${r}" data-r="${r}${also ? ' ' + also : ''}">${u(k)}</a>`).join('') +
    `<button class="nav-theme" type="button" data-theme-toggle><svg class="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="i-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>☾ / ☀</button><a class="nav-book" href="#/rfq">${u('rfq')}</a><div class="nav-langs">${LANGS.map((l) => `<button type="button" data-lang="${l.code}" class="${l.code === lang ? 'on' : ''}"><span class="lflag">${FLAGS[l.code]}</span>${l.code.toUpperCase()}</button>`).join('')}</div>`;
  $('#aiPill').innerHTML = `${I.ai}<span>${u('aiName')}</span>`;
  $('#langBtn').innerHTML = `<span class="lang-globe">${I.globe}</span><span class="lang-code">${lang.toUpperCase()}</span><svg class="lang-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`;
  $('#langMenu').innerHTML = `<span class="lang-title">${I.globe}${u('chooseLang')}</span>` + LANGS.map((l) => `<button role="menuitemradio" aria-checked="${l.code === lang}" data-lang="${l.code}" class="${l.code === lang ? 'on' : ''}"><span class="lflag">${FLAGS[l.code]}</span><span class="lang-name"><b>${l.name}</b></span><span class="lang-tag">${l.code.toUpperCase()}</span></button>`).join('');
  $('#hdrBook').innerHTML = `${I.doc} ${u('rfq')}`;
  $('#ftr').innerHTML = `<div class="wrap ftr-grid">
    <div><a href="#/" class="logo ftr-logo">${LOGO}</a><p>${u('footer')}</p>
      <div class="socials"><a href="${CO.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a><a href="${CO.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}</a><a href="${CO.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}</a><a href="mailto:${CO.email}" aria-label="Email">${I.mail}</a></div></div>
    <div><h5>${u('commodities')}</h5>${COMMODITIES.map((c) => `<a href="#/commodity/${c.id}">${CM(c.id).t}</a>`).join('')}</div>
    <div><h5>${u('pages')}</h5>${SERVICES.map((s) => `<a href="#/${s.id}">${SV(s.id).t}</a>`).join('')}<a href="#/sectors">${u('sectors')}</a><a href="#/about">${u('about')}</a><a href="#/rfq">${u('rfq')}</a><a href="#/contact">${u('contact')}</a></div>
    <div class="ftr-c"><h5>${u('contact')}</h5><p>${I.phone}<a href="${CO.phoneHref}">${ltr(CO.phone)}</a></p><p>${I.whatsapp}<a href="${CO.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></p><p>${I.mail}<a href="mailto:${CO.email}">${CO.email}</a></p><p>${I.pin}<span>${CO.address}</span></p><p>${I.clock}<span>${u('hours')}</span></p></div>
  </div>
  <div class="wrap ftr-bot"><span>© ${new Date().getFullYear()} ${CO.name}. ${u('rights')}</span><span>KVKK · ${u('legal')}</span></div>`;
  $('#dock').innerHTML = `
    <a class="dk wa" href="${CO.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}<span class="tip">WhatsApp</span></a>
    <a class="dk li" href="${CO.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}<span class="tip">LinkedIn</span></a>
    <a class="dk ig" href="${CO.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}<span class="tip">Instagram</span></a>
    <a class="dk mail" href="mailto:${CO.email}" aria-label="Email">${I.mail}<span class="tip">${u('emailL')}</span></a>
    <div class="dk-ai-wrap">
      <div class="ai-teaser" id="aiTeaser" hidden><button class="ai-teaser-x" aria-label="×">${I.x}</button><p>${u('teaser')}</p><button class="ai-teaser-go" data-ai>${u('teaserGo')} ${I.arrow}</button></div>
      <button class="dk-ai" data-ai aria-label="${u('aiOpen')}"><span class="dk-ai-av">${I.ai}</span><span class="dk-ai-t"><b>${u('aiName')}</b><small><i class="dot"></i> ${u('online')}</small></span></button>
    </div>`;
  $('#aiAv').innerHTML = I.ai;
  $('#aiTitle').textContent = u('aiName');
  $('#aiStatus').textContent = P().ai.status;
  $('#aiText').placeholder = P().ai.ph;
  $('.skip').textContent = { en: 'Skip to content', tr: 'İçeriğe geç', de: 'Zum Inhalt', fr: 'Aller au contenu', ar: 'انتقل إلى المحتوى' }[lang];
  setSug();
}

/* ---------------- Router ---------------- */
function render() {
  if (location.hash && !location.hash.startsWith('#/')) return;
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathQ, anchor] = raw.split('#');
  const [path, qs] = pathQ.split('?');
  const [name, ...args] = path.split('/').filter(Boolean);
  stopMotion();
  app.innerHTML = (ROUTES[name || ''] || notFound)(new URLSearchParams(qs || ''), ...args.map(decodeURIComponent));
  hdr.classList.toggle('over', !!$('#cine'));
  closeMenus();
  window.scrollTo({ top: 0, behavior: 'instant' });
  $$('#nav [data-r]').forEach((a) => a.classList.toggle('on', a.dataset.r.split(' ').includes(name || '')));
  after();
  if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 160);
}
window.addEventListener('hashchange', render);

let obs;
function after() {
  obs?.disconnect();
  obs = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add('in'); obs.unobserve(e.target); }), { threshold: 0.1 });
  $$('.rv', app).forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); return; } el.style.transitionDelay = (i % 4) * 0.06 + 's'; obs.observe(el); });
  if ($('#jnTool')) { renderJourney(); autoJourney(); }
  if ($('#cine')) initCine();
  $$('.wsplit', app).forEach(splitWords);
  if ($('#ndtViz')) renderNdt();
  if ($('#rfqTool')) renderRfqSum();
  bindForms();
  window.FX?.mount();
}
function bindForms() {
  const check = (f) => { let ok = true; $$('[required]', f).forEach((el) => { const bad = el.type === 'checkbox' ? !el.checked : (!el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value))); (el.type === 'checkbox' ? el.parentElement : el).classList.toggle('bad', bad); if (bad) ok = false; }); return ok; };
  const done = (msg, txt) => { msg.className = 'frm-msg ok'; msg.innerHTML = `${u('formOk')}<br><span class="acts" style="justify-content:center"><a class="btn btn-plum" href="${mailHref(txt)}">${I.mail} ${u('sendMail')}</a><a class="btn btn-wa" target="_blank" rel="noopener" href="${CO.whatsapp}?text=${encodeURIComponent(txt)}">${I.whatsapp} WhatsApp</a></span>`; };
  const val = (id) => $(id)?.value.trim() || '';
  $('#fRfq')?.addEventListener('submit', (e) => {
    e.preventDefault(); const f = e.target, msg = $('.frm-msg', f);
    if (!rq.c) { msg.className = 'frm-msg err'; msg.textContent = `${u('formErr')} (${P().rfq.s1})`; return; }
    if (!check(f)) { msg.className = 'frm-msg err'; msg.textContent = u('formErr'); return; }
    done(msg, rfqText([[u('name'), val('#r-name')], [u('company'), val('#r-company')], [u('email'), val('#r-email')], [u('phone'), val('#r-phone')], [u('country'), val('#r-country')], [u('message'), val('#r-message')]]));
  });
  $('#fContact')?.addEventListener('submit', (e) => {
    e.preventDefault(); const f = e.target, msg = $('.frm-msg', f);
    if (!check(f)) { msg.className = 'frm-msg err'; msg.textContent = u('formErr'); return; }
    done(msg, [[u('name'), val('#c-name')], [u('company'), val('#c-company')], [u('email'), val('#c-email')], [u('phone'), val('#c-phone')], [u('country'), val('#c-country')], [u('message'), val('#c-message')]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n'));
  });
}

/* ==========================================================================
   Global UI
   ========================================================================== */
const hdr = $('#hdr');
let ticking = false;
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', scrollY > 30);
  if (ticking || !$('#cine')) return; ticking = true;
  requestAnimationFrame(() => { ticking = false; const y = scrollY, m = $('#cineMedia'), t = $('#cineIn'); if (m && y < 1200) m.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0)`; if (t && y < 1200) { t.style.transform = `translate3d(0, ${(y * 0.14).toFixed(1)}px, 0)`; t.style.opacity = Math.max(0, 1 - y / 650).toFixed(3); } });
}, { passive: true });
const burger = $('#burger'), nav = $('#nav');
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); document.body.classList.toggle('lock', o); hdr.classList.toggle('menu', o); });
nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenus(); });
function closeMenus() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); hdr.classList.remove('menu'); }
const langBox = $('#lang');
$('#langBtn').addEventListener('click', (e) => { e.stopPropagation(); const o = langBox.classList.toggle('open'); $('#langBtn').setAttribute('aria-expanded', o); if (o) $('#aiTeaser')?.setAttribute('hidden', ''); });
document.addEventListener('click', (e) => { if (!e.target.closest('#lang')) { langBox.classList.remove('open'); $('#langBtn').setAttribute('aria-expanded', 'false'); } });
async function setLang(code) {
  langBox.classList.remove('open');
  if (code === lang) return;
  try { await loadLang(code); } catch (e) { toast('⚠️ ' + code); return; }
  lang = code; try { localStorage.setItem('sxx-lang', lang); } catch (e2) {}
  window.FX?.curtain(() => { renderChrome(); render(); greeted = false; aiBody.innerHTML = ''; });
}
document.addEventListener('click', (e) => {
  if (e.target.closest('#themeBtn, [data-theme-toggle]')) {
    const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('sxx-theme', r.dataset.theme); } catch (e2) {}
    return;
  }
  const lb = e.target.closest('[data-lang]'); if (lb) { setLang(lb.dataset.lang); return; }
  const jn = e.target.closest('[data-jn]'); if (jn) { jnCur = +jn.dataset.jn; jnUser = true; clearInterval(jnT); $('#jnAuto')?.classList.remove('run'); renderJourney(); return; }
  const sl = e.target.closest('[data-slide]'); if (sl) { goSlide(+sl.dataset.slide); return; }
  const nd = e.target.closest('[data-ndt]'); if (nd) { ndtCur = nd.dataset.ndt; renderNdt(); return; }
  const rc = e.target.closest('[data-rc]'); if (rc) { rq.c = rc.dataset.rc; $$('[data-rc]').forEach((x) => x.classList.toggle('on', x === rc)); renderRfqSum(); return; }
  const rx = e.target.closest('[data-rx]'); if (rx) { const k = rx.dataset.rx; rq.x.has(k) ? rq.x.delete(k) : rq.x.add(k); rx.classList.toggle('on', rq.x.has(k)); renderRfqSum(); return; }
  const rl = e.target.closest('[data-rl]'); if (rl) { rq.lv = rl.dataset.rl; $$('[data-rl]').forEach((x) => x.classList.toggle('on', x === rl)); renderRfqSum(); return; }
  const ai = e.target.closest('[data-ai]'); if (ai) { e.preventDefault(); openAI(ai.dataset.ai); }
  if (e.target.closest('.ai-teaser-x, [data-ai]')) { $('#aiTeaser')?.setAttribute('hidden', ''); try { sessionStorage.setItem('sxx-teaser', '1'); } catch (e2) {} }
});
const rqInput = (e) => {
  const id = e.target.id;
  if (id === 'r-mat') rq.mat = +e.target.value; else if (id === 'r-sector') rq.sector = e.target.value; else if (id === 'r-qty') rq.qty = e.target.value; else if (id === 'r-date') rq.date = e.target.value; else return;
  renderRfqSum();
};
document.addEventListener('input', rqInput);
document.addEventListener('change', rqInput);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAI(); closeMenus(); } });
let toastT;
function toast(html) { const el = $('#toast'); el.innerHTML = html; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }

/* ==========================================================================
   Motion: hero slideshow, sparks, rotator, split headline, auto journey and
   card spotlight. Everything stops on route change and respects
   prefers-reduced-motion.
   ========================================================================== */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SLIDE_MS = 6500;
let slideT, rotT, jnT, sparkStop, slideCur = 0, rotCur = 0, jnUser = false;
function stopMotion() { clearInterval(slideT); clearInterval(rotT); clearInterval(jnT); sparkStop?.(); sparkStop = null; }
function goSlide(i) {
  const cs = $$('.cs'), pg = $$('#cinePager button'); if (!cs.length) return;
  slideCur = (i + cs.length) % cs.length;
  cs.forEach((c, k) => c.classList.toggle('on', k === slideCur));
  pg.forEach((b, k) => { b.classList.remove('on'); b.classList.toggle('done', k < slideCur); });
  void pg[slideCur].offsetWidth; pg[slideCur].classList.add('on');
  clearInterval(slideT); if (!REDUCED) slideT = setInterval(() => goSlide(slideCur + 1), SLIDE_MS);
}
function initCine() {
  $('#cinePager')?.style.setProperty('--dur', SLIDE_MS / 1000 + 's');
  goSlide(0);
  const list = $('#rotList'), n = SECTORS.length;
  rotCur = 0;
  if (list && !REDUCED) rotT = setInterval(() => {
    rotCur++; list.style.transition = ''; list.style.transform = `translateY(-${rotCur * 1.6}em)`;
    if (rotCur === n) setTimeout(() => { list.style.transition = 'none'; list.style.transform = 'translateY(0)'; rotCur = 0; }, 650);
  }, 2400);
  const cv = $('#sparks'); if (cv && !REDUCED) sparkStop = sparks(cv);
}
/* welding sparks and drifting embers on a canvas */
function sparks(cv) {
  const ctx = cv.getContext('2d'); let W = 0, H = 0, raf = 0, last = performance.now(), next = 0, on = true;
  const ps = [];
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);
  const rtl = () => document.documentElement.dir === 'rtl';
  const ember = () => ps.push({ x: Math.random() * W, y: H + 10, vx: (Math.random() - 0.5) * 18, vy: -(20 + Math.random() * 45), g: -4, life: 4 + Math.random() * 4, max: 8, r: 0.8 + Math.random() * 1.8, ember: true });
  const burst = () => {
    const ex = W * (rtl() ? 0.3 : 0.7) + (Math.random() - 0.5) * W * 0.12, ey = H * (0.62 + Math.random() * 0.12);
    for (let k = 0; k < 26; k++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3, v = 140 + Math.random() * 320; ps.push({ x: ex, y: ey, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 420, life: 0.5 + Math.random() * 0.9, max: 1.4, r: 1 + Math.random() * 1.3 }); }
  };
  const io = new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  io.observe(cv);
  function loop(now) {
    if (!on || document.hidden || !document.contains(cv)) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (Math.random() < 0.35 && ps.length < 160) ember();
    next -= dt; if (next <= 0) { burst(); next = 0.9 + Math.random() * 2.2; }
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.ember) p.vx += Math.sin(now / 600 + i) * 2 * dt;
      if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > W + 20) { ps.splice(i, 1); continue; }
      const a = Math.min(1, (p.life / p.max) * 1.6);
      if (p.ember) { ctx.fillStyle = `hsla(${24 + (i % 20)}, 100%, ${55 + (i % 15)}%, ${(a * 0.75).toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.strokeStyle = `hsla(${32 + (i % 18)}, 100%, 70%, ${a.toFixed(3)})`; ctx.lineWidth = p.r; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035); ctx.stroke(); }
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); on = false; };
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && $('#sparks') && sparkStop) { sparkStop(); sparkStop = sparks($('#sparks')); } });
/* split a headline into masked words for the rise-in animation */
function splitWords(el) {
  if (el.dataset.split || REDUCED) return; el.dataset.split = 1; let i = 0;
  const walk = (node) => [...node.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        const o = document.createElement('span'); o.className = 'w'; const n = document.createElement('span'); n.textContent = w; n.style.setProperty('--i', i++); o.appendChild(n); frag.appendChild(o);
      });
      c.replaceWith(frag);
    } else if (c.nodeType === 1) walk(c);
  });
  walk(el);
}
/* the order journey plays itself while visible, until the visitor clicks a stage */
function autoJourney() {
  const box = $('#jnTool'); if (!box || REDUCED || jnUser) return;
  const io = new IntersectionObserver(([e]) => {
    clearInterval(jnT); $('#jnAuto')?.classList.toggle('run', e.isIntersecting && !jnUser);
    if (e.isIntersecting && !jnUser) jnT = setInterval(() => { if (!document.contains(box)) { clearInterval(jnT); io.disconnect(); return; } jnCur = (jnCur + 1) % JOURNEY.length; renderJourney(); }, 3000);
  }, { threshold: 0.4 });
  io.observe(box);
}
/* soft spotlight that follows the pointer on cards */
document.addEventListener('pointermove', (e) => {
  const c = e.target.closest?.('.s3, .svc, .why > div'); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

/* ==========================================================================
   AI assistant — general company information in five languages. For a
   production LLM, replace answer() with a backend call.
   ========================================================================== */
const KW = {
  price: ['price', 'cost', 'how much', ' fee', 'fiyat', 'ücret', 'maliyet', 'kaç para', 'preis', 'kosten', 'was kostet', 'prix', 'tarif', 'coût', 'combien', 'سعر', 'تكلفة', ' كم '],
  rfq: ['quote', 'rfq', 'quotation', 'teklif', 'angebot', 'anfrage', 'devis', 'cotation', 'عرض سعر', 'طلب عرض'],
  ndt: ['ndt', 'zfp', 'cnd', 'ultrason', 'radiograph', 'magnetic', 'penetrant', 'x-ray', 'tahribatsız', 'röntgen', 'manyetik', 'zerstörungsfrei', 'ultraschall', 'durchstrahl', 'magnetpulver', 'eindring', 'non destructif', 'ressuage', 'magnétoscopie', 'غير الإتلافي', 'الموجات فوق', 'الأشعة', 'السائل النافذ'],
  late: ['delay', 'late', 'on time', 'otd', 'gecik', 'zamanında', 'termin', 'verzöger', 'pünktlich', 'retard', 'délai', 'تأخير', 'في الوقت'],
  sectors: ['sector', 'industr', 'sektör', 'branche', 'secteur', 'قطاع', 'القطاعات'],
  contact: ['contact', 'phone', 'email', 'e-mail', 'address', 'where', 'iletişim', 'telefon', 'adres', 'nerede', 'kontakt', 'adresse', 'téléphone', ' où ', 'اتصال', 'هاتف', 'بريد', 'عنوان', 'أين'],
  langs: ['language', 'speak', 'english', 'turkish', 'dil ', 'ingilizce', 'sprache', 'deutsch', 'englisch', 'langue', 'anglais', 'لغة', 'تتكلم'],
  hello: ['hello', 'hi ', 'hey', 'merhaba', 'selam', 'hallo', 'guten tag', 'bonjour', 'salut', 'مرحبا', 'السلام'],
  thanks: ['thank', 'teşekkür', 'sağol', 'danke', 'merci', 'شكرا'],
};
const COMM_KW = {
  heavy: ['heavy weld', 'heavy struct', 'turbine', 'generator', 'pipeline', 'piping', 'spool', 'storage tank', 'kiln', 'crusher', 'pwht', 'ağır kaynak', 'boru', 'türbin', 'schwere', 'rohrleitung', 'turbin', 'lourde', 'tuyauterie', 'الثقيلة', 'أنابيب', 'توربين'],
  light: ['light weld', 'structural steel', 'duct', 'hopper', 'air intake', 'hafif', 'çelik konstrüksiyon', 'kanal', 'leichte', 'stahlbau', 'légère', 'charpente', 'gaine', 'الخفيفة', 'هياكل فولاذية'],
  machining: ['machin', 'cnc', 'turning', 'milling', 'talaşlı', 'işleme', 'torna', 'zerspan', 'fräs', 'drehen', 'usinage', 'tournage', 'التشغيل', 'خراطة'],
  sheet: ['sheet', 'laser', 'plasma', 'waterjet', 'bending', 'sac ', 'lazer', 'büküm', 'blech', 'tôle', 'pliage', 'الصفائح', 'ليزر'],
  forging: ['forg', 'dövme', 'schmied', 'forgé', 'forge', 'الحدادة', 'تطريق', 'مطروق'],
  casting: ['cast', 'foundry', 'döküm', 'guss', 'gieß', 'fonderie', 'moulage', 'الصب', 'سباكة', 'مسبوك'],
};
const SVC_KW = {
  sourcing: ['sourc', 'supplier', 'procure', 'tedarik', 'satın alma', 'beschaffung', 'lieferant', 'approvisionnement', 'fournisseur', 'التوريد', 'توريد', 'تورد', 'مورد'],
  expediting: ['expedit', 'progress', 'schedule', 'follow', 'takip', 'ilerleme', 'fortschritt', 'suivi', 'relance', 'planning', 'متابعة', 'الجدول'],
  inspection: ['inspect', 'itp', 'quality', 'qc', 'weld', 'muayene', 'denetim', 'kalite', 'kaynak', 'inspektion', 'prüfung', 'qualität', 'schweiß', 'qualité', 'contrôle', 'soudure', 'فحص', 'تفتيش', 'جودة', 'لحام'],
};
const norm = (s) => s.toLocaleLowerCase(lang === 'tr' ? 'tr' : undefined).replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا');
const low = (q) => ' ' + norm(q) + ' ' + q.toLowerCase() + ' ';
const card = (icon, t, s) => `<div class="ai-svc"><span>${I[icon]}</span><div><b>${t}</b><small>${s}</small></div></div>`;
function answer(q) {
  const s = low(q.trim()), A = P().ai;
  const hit = (list) => list.some((w) => s.includes(norm(w)));
  const has = (k) => hit(KW[k]);
  const cm = Object.keys(COMM_KW).find((id) => hit(COMM_KW[id]));
  const sv = Object.keys(SVC_KW).find((id) => hit(SVC_KW[id]));
  const rfqAct = { href: `#/rfq${cm ? '?c=' + cm : ''}`, label: A.cta.rfq };
  if (has('price')) return { html: A.price, actions: [rfqAct, { wa: q, label: 'WhatsApp' }] };
  if (has('rfq')) return { html: A.rfq, actions: [rfqAct, { mail: q, label: u('emailL') }] };
  if (has('ndt')) return { html: A.ndt + `<div class="jd"><ul>${NDT.map((k) => `<li><b>${P().ndt[k][0]}</b></li>`).join('')}</ul></div>`, actions: [{ href: '#/inspection#ndt', label: A.cta.inspection }, rfqAct] };
  if (has('late')) return { html: A.late, actions: [{ href: '#/expediting', label: SV('expediting').t }, rfqAct] };
  if (cm) { const T = CM(cm), c = COMMODITIES.find((x) => x.id === cm); return { html: `${card(c.icon, T.t, T.s)}${T.i}<div class="jd"><ul>${T.a[1].map(([t]) => `<li>${t}</li>`).join('')}</ul></div>`, actions: [{ href: `#/commodity/${cm}`, label: u('readMore') }, rfqAct] }; }
  if (sv) { const T = SV(sv), c = SERVICES.find((x) => x.id === sv); return { html: `${card(c.icon, T.t, T.s)}${T.i}<div class="jd"><ul>${T.list.map(([t]) => `<li>${t}</li>`).join('')}</ul></div>`, actions: [{ href: `#/${sv}`, label: u('readMore') }, rfqAct] }; }
  if (has('sectors')) return { html: A.sectors, actions: [{ href: '#/sectors', label: u('sectors') }] };
  if (has('contact')) return { html: `<div class="jd">${I.phone} ${ltr(CO.phone)}<br>${I.mail} ${CO.email}<br>${I.clock} ${u('hours')}</div>`, actions: [{ href: '#/contact', label: A.cta.contact }, { wa: q, label: 'WhatsApp' }] };
  if (has('langs')) return { html: A.langs };
  if (has('hello')) return { html: A.hello };
  if (has('thanks')) return { html: A.thanks };
  return { html: A.fallback, actions: [{ href: '#/contact', label: A.cta.contact }, { wa: q, label: 'WhatsApp' }] };
}
const aiEl = $('#ai'), aiBody = $('#aiBody');
let greeted = false;
function openAI(q) {
  aiEl.classList.add('open'); aiEl.setAttribute('aria-hidden', 'false');
  if (!greeted) { greeted = true; msg('bot', { html: P().ai.greet }); }
  if (q) ask(q);
  setTimeout(() => $('#aiText').focus(), 250);
}
function closeAI() { aiEl.classList.remove('open'); aiEl.setAttribute('aria-hidden', 'true'); }
$('#aiClose').addEventListener('click', closeAI);
function actionsHTML(acts = []) {
  if (!acts.length) return '';
  return `<div class="ai-acts">${acts.map((a) => a.wa ? `<a class="chip wa" target="_blank" rel="noopener" href="${CO.whatsapp}?text=${encodeURIComponent(a.wa)}">${I.whatsapp}<span>${a.label}</span></a>`
    : a.mail ? `<a class="chip" href="mailto:${CO.email}?body=${encodeURIComponent(a.mail)}">${I.mail}<span>${a.label}</span></a>`
    : `<a class="chip" href="${a.href}">${a.label} ${I.arrow}</a>`).join('')}</div>`;
}
function msg(who, r) { const m = document.createElement('div'); m.className = 'm ' + who; if (who === 'me') m.textContent = r; else m.innerHTML = r.html + actionsHTML(r.actions); aiBody.appendChild(m); aiBody.scrollTop = aiBody.scrollHeight; return m; }
function setSug(list) { $('#aiSug').innerHTML = (list || P().ai.sug).map((x) => `<button>${esc(x)}</button>`).join(''); }
function ask(q) {
  if (!q.trim()) return; msg('me', q);
  const tp = msg('bot', { html: '<span class="typing"><i></i><i></i><i></i></span>' });
  setTimeout(() => { const r = answer(q); tp.innerHTML = r.html + actionsHTML(r.actions); aiBody.scrollTop = aiBody.scrollHeight; }, 500 + Math.random() * 400);
}
$('#aiForm').addEventListener('submit', (e) => { e.preventDefault(); ask($('#aiText').value); $('#aiText').value = ''; });
$('#aiSug').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });

/* ---------------- Boot ---------------- */
(async () => {
  if (lang !== 'en') { try { await loadLang(lang); } catch (e) { lang = 'en'; } }
  renderChrome();
  render();
  if (new URLSearchParams(location.search).has('nointro')) { $('#intro')?.remove(); $$('.rv').forEach((e) => e.classList.add('in')); }
  setTimeout(() => $('#intro')?.classList.add('done'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1100);
  setTimeout(() => { let seen = false; try { seen = sessionStorage.getItem('sxx-teaser') === '1'; } catch (e) {} if (!seen && !aiEl.classList.contains('open')) $('#aiTeaser')?.removeAttribute('hidden'); }, 3500);
})();
