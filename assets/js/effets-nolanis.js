/* Effets propres à Nolanis (direction « Bon à tirer »). Chaque effet porte data-effet="nom-du-plan" dans les pages.
   Mécaniques reprises de la bibliothèque des maquettes (adaptées au socle de la skill) :
   objet-a-faire-tourner (repère), fil-conducteur (trait de coupe), planches-empilees (liasse), axes-au-defilement (encre).
   Règles : aucune mesure de mise en page pendant le défilement (tout est mesuré au refresh), boucles du socle
   (arrêtées hors écran, onglet caché et en mode calme), mode calme : état final, rien ne bouge. */
import { boucle, etat, quand, rafraichir } from './socle/index.js?v=3';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const borne = (v, a, b) => Math.max(a, Math.min(b, v));
const lisse = (t) => t * t * (3 - 2 * t);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const etroit = () => matchMedia('(max-width: 760px)').matches;

/* Vitesse de défilement lissée (px/s), partagée, sans aucune lecture de mise en page. */
export const vitesse = { v: 0, cible: 0 };
{
  let y = scrollY, t = performance.now();
  addEventListener('scroll', () => {
    const n = performance.now(), dt = Math.max(1, n - t);
    vitesse.cible = borne((scrollY - y) / dt * 1000, -5000, 5000); y = scrollY; t = n;
  }, { passive: true });
}

/* ================= CALAGE : photo d'ouverture en quatre couches, repère à faire tourner ================= */
/* État partagé : amplitude du décalage des couleurs (0 = calé), angle du repère, part de l'intro. */
export const calage = { A: 0, intro: 0, angle: 0, w: 0, cale: null };

function shaderCalage(canvas, img) {
  let gl = null;
  try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch { gl = null; }
  if (!gl) return null;
  const vs = 'attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }';
  const fs = 'precision mediump float; varying vec2 v; uniform sampler2D t; uniform vec4 k; uniform vec2 oc, om, oy;'
    + 'vec3 lit(vec2 u){ return texture2D(t, clamp(u, 0.001, .999)).rgb; }'
    + 'void main(){ vec2 u = k.xy*v + k.zw; float r = lit(u+oc).r; float g = lit(u+om).g; float b = lit(u+oy).b; gl_FragColor = vec4(r,g,b,1.); }';
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uk = U('k'), uc = U('oc'), um = U('om'), uy = U('oy');
  let pretTex = false, k = [1, 1, 0, 0], W = 0, H = 0;
  const charger = () => new Promise((ok) => {
    const im = new Image(); im.decoding = 'async'; im.src = img.currentSrc || img.src;
    im.onload = () => { try { gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); pretTex = { w: im.naturalWidth, h: im.naturalHeight }; mesurer(); } catch {} ok(); };
    im.onerror = () => ok();
  });
  function mesurer() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, etroit() ? 1 : 1.25);
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
    if (!pretTex) return;
    const cs = getComputedStyle(img).objectPosition.split(' ').map((x) => parseFloat(x) / 100);
    const s = Math.max(r.width / pretTex.w, r.height / pretTex.h), dw = pretTex.w * s, dh = pretTex.h * s;
    const ox = (r.width - dw) * (cs[0] ?? .5), oy = (r.height - dh) * (cs[1] ?? .5);
    k = [r.width / dw, r.height / dh, -ox / dw, -oy / dh];
  }
  return {
    charger, mesurer,
    dessiner(A, ang) {
      if (!pretTex) return;
      const o = (d) => [A * Math.cos(ang + d), A * Math.sin(ang + d) * (W / Math.max(1, H))];
      gl.uniform4f(uk, ...k); gl.uniform2f(uc, ...o(0)); gl.uniform2f(um, ...o(2.094)); gl.uniform2f(uy, ...o(4.189));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}

export function initCalage() {
  const hero = $('.hero'); if (!hero) return null;
  const canvas = $('.hero-calage', hero), img = $('[data-calage-image] img', hero), oat = $('.oat', hero);
  const titre = $('.hero-titre', hero), etiquette = $('[data-etat-calage]', hero);
  const couches = $$('.oat__couche', hero);
  const poserCouches = (A, ang) => {
    const px = Math.min(16, A * 520);
    couches.forEach((el, i) => {
      if (i === 3) return; const a = ang + i * 2.094;
      el.style.setProperty('--dx', `${(Math.cos(a) * px).toFixed(2)}px`); el.style.setProperty('--dy', `${(Math.sin(a) * px).toFixed(2)}px`);
    });
    if (titre) { titre.style.setProperty('--qx', `${Math.min(14, A * 380).toFixed(2)}px`); titre.style.setProperty('--qy', `${Math.min(9, A * 240).toFixed(2)}px`); }
  };
  etiquette?.classList.add('calee'); calage.cale = true;
  if (etat.calme) { poserCouches(0, 0); return { pret: Promise.resolve() }; }

  let gl = null;
  try { gl = canvas ? shaderCalage(canvas, img) : null; } catch (err) { console.warn('[calage] WebGL indisponible', err); gl = null; }
  const pret = gl ? Promise.race([gl.charger(), new Promise((r) => setTimeout(r, 1200))]) : Promise.resolve();
  if (gl) { addEventListener('resize', () => gl.mesurer()); quand('pret', () => gl.mesurer()); if (window.ResizeObserver) new ResizeObserver(() => gl.mesurer()).observe(canvas); }

  /* Repère : on l'attrape et on le fait tourner (élan au lâcher), le défilement le fait tourner aussi. */
  const o = { repos: .14, defilement: .0045, amorti: 1.5, elanMax: 34 };
  const s = { angle: 0, elan: 0, tenu: false, lum: .75, lumC: .75, eclat: 0, eclatC: 0, v: 0 };
  let c = null, a0 = 0, t0 = 0, w = 0, id = null;
  const objet = $('.oat__objet', oat), indice = $('.oat__indice', oat);
  const encreG = gouttes($('.hero-gouttes', hero), oat);
  oat.classList.add('est-actif');
  const mesurerC = () => { const r = objet.getBoundingClientRect(); c = { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 }; };
  const ang = (e) => Math.atan2(e.clientY - c.y, e.clientX - c.x);
  oat.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return; mesurerC();
    if (Math.hypot(e.clientX - c.x, e.clientY - c.y) > c.r) return;
    id = e.pointerId; s.tenu = true; a0 = ang(e); t0 = performance.now(); w = 0;
    oat.setPointerCapture?.(id); oat.classList.add('est-tenu'); indice?.classList.add('est-vu');
  });
  oat.addEventListener('pointermove', (e) => {
    if (!s.tenu || e.pointerId !== id) return;
    const a = ang(e), t = performance.now(); let d = a - a0; d = Math.atan2(Math.sin(d), Math.cos(d));
    s.angle += d; w += (d / (Math.max(1, t - t0) / 1000) - w) * .35; a0 = a; t0 = t;
  });
  const lacher = (e) => {
    if (!s.tenu || (e && e.pointerId !== id)) return; s.tenu = false; id = null;
    s.elan = performance.now() - t0 > 120 ? 0 : borne(w - o.repos, -o.elanMax, o.elanMax); oat.classList.remove('est-tenu');
    if (Math.abs(s.elan) > 7) encreG.lancer(s.elan, s.angle);
  };
  oat.addEventListener('pointerup', lacher); oat.addEventListener('pointercancel', lacher);
  /* Clavier : flèches gauche et droite donnent un tour d'élan. */
  oat.tabIndex = 0;
  oat.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); s.elan += e.key === 'ArrowRight' ? 9 : -9; indice?.classList.add('est-vu'); if (Math.abs(s.elan) > 16) encreG.lancer(s.elan, s.angle); } });
  /* Lumière du reflet vers la souris (jamais au doigt), amortie : elle se stabilise dès que la souris s'arrête. */
  hero.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; if (!c) mesurerC(); s.lumC = Math.atan2(-(e.clientY - c.y), e.clientX - c.x); s.eclatC = 1; });
  hero.addEventListener('pointerleave', () => { s.lumC = .75; s.eclatC = 0; });
  addEventListener('resize', () => { c = null; }); addEventListener('scroll', () => { c = null; }, { passive: true });

  let visibleCanvas = false;
  boucle(hero, (dt) => {
    vitesse.cible *= Math.exp(-dt * 6); vitesse.v += (vitesse.cible - vitesse.v) * (1 - Math.exp(-dt * 10));
    const avant = s.angle;
    if (!s.tenu) { s.angle += (o.repos + vitesse.v * o.defilement + s.elan) * dt; s.elan *= Math.exp(-dt * o.amorti); }
    s.v = (s.angle - avant) / Math.max(dt, .001) || (s.tenu ? w : 0);
    let dl = s.lumC - s.lum; dl = Math.atan2(Math.sin(dl), Math.cos(dl)); s.lum += dl * (1 - Math.exp(-dt * 6));
    s.eclat += (s.eclatC - s.eclat) * (1 - Math.exp(-dt * 5));
    oat.style.setProperty('--oat-angle', `${(s.angle * 180 / Math.PI).toFixed(2)}deg`);
    oat.style.setProperty('--oat-lumiere', `${(90 - s.lum * 180 / Math.PI).toFixed(1)}deg`);
    oat.style.setProperty('--oat-eclat', s.eclat.toFixed(3));
    /* Plus le repère tourne vite, plus les couleurs se décalent ; il ralentit : la photo se cale. */
    const exces = Math.max(0, Math.abs(s.v) - .45);
    const cible = Math.min(.05, exces * .0042 + calage.intro * .045);
    calage.A += (cible - calage.A) * (1 - Math.exp(-dt * (cible > calage.A ? 9 : 3.2)));
    if (calage.A < .00035 && cible === 0) calage.A = 0;
    calage.angle = s.angle;
    poserCouches(calage.A, s.angle * .8);
    const cale = calage.A === 0;
    if (cale !== calage.cale) { calage.cale = cale; etiquette?.classList.toggle('calee', cale); }
    if (gl) {
      const doit = calage.A > 0;
      if (doit) gl.dessiner(calage.A, s.angle * .8);
      if (doit !== visibleCanvas) { visibleCanvas = doit; canvas.classList.toggle('actif', doit); }
    }
  });
  return { pret };
}

/* ================= QUADRI : titres imprimés en quatre passages ================= */
export function quadriAuDefilement() {
  $$('[data-effet="quadri-defilement"]').forEach((el) => {
    if (etat.calme || !ST) return;
    const poser = (p) => { const k = 1 - lisse(borne(p, 0, 1)); el.style.setProperty('--qx', `${(k * 26).toFixed(1)}px`); el.style.setProperty('--qy', `${(k * 14).toFixed(1)}px`); };
    poser(0);
    ST.create({ trigger: el, start: 'top 95%', end: 'center 45%', onUpdate: (st) => poser(st.progress), onRefresh: (st) => poser(st.progress) });
  });
}
/* Décalage des passages d'un titre, joué une fois (intro ou arrivée). */
export function imprimer(tl, el, a = 0, d = .9) {
  if (!el) return;
  tl.fromTo(el, { '--qx': '18px', '--qy': '10px' }, { '--qx': '0px', '--qy': '0px', duration: d, ease: 'power3.out' }, a);
}

/* ================= ENCRE : axe SOFT de Fraunces, l'encre bave puis sèche (largeur inchangée) ================= */
export function encre() {
  $$('[data-axes]').forEach((el) => {
    const poser = (p) => { el.style.fontVariationSettings = `"SOFT" ${Math.round((1 - p) * 100)}, "WONK" 0`; };
    if (etat.calme || !ST) { poser(1); return; }
    poser(0);
    ST.create({ trigger: el, start: 'top 92%', end: 'top 35%', onUpdate: (st) => poser(st.progress), onRefresh: (st) => poser(st.progress) });
  });
}

/* ================= FIL : trait de coupe dans la marge, repère au bout (module fil-conducteur) ================= */
export function fil(root = $('main')) {
  if (!root || !gsap || !ST) return;
  const NS = 'http://www.w3.org/2000/svg', f = (n) => n.toFixed(1);
  const o = { regard: .62, marge: .5, cadre: '.conteneur', onde: 8, lissage: .45, largeurTelephone: 700 };
  const calme = etat.calme;
  root.classList.add('fic');
  const el = (nom, cls, parent) => { const e = document.createElementNS(NS, nom); if (cls) e.setAttribute('class', cls); parent?.appendChild(e); return e; };
  const svg = el('svg', 'fic__svg'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('data-audit-ignorer', '');
  const rail = el('path', 'fic__rail', svg), trace = el('path', 'fic__trace', svg), gPerles = el('g', 'fic__perles', svg);
  const objet = calme ? null : el('g', 'fic__objet', svg);
  const modele = root.querySelector('template[data-fil-objet]');
  if (objet && modele) objet.innerHTML = modele.innerHTML;
  root.prepend(svg);
  let L = 0, pas = 1, table = [], ancres = [], haut = 0, maxScroll = 1;
  const e = { l: 0 };
  function longueurPourY(y) {
    if (!table.length) return 0; let lo = 0, hi = table.length - 1;
    if (y >= table[hi][3]) return L;
    while (lo < hi) { const m = (lo + hi) >> 1; if (table[m][3] >= y) hi = m; else lo = m + 1; }
    return table[lo][0];
  }
  function cible() {
    const proche = maxScroll > 0 ? borne((scrollY - (maxScroll - innerHeight * .5)) / (innerHeight * .5), 0, 1) : 1;
    return longueurPourY(scrollY + innerHeight * (o.regard + (1 - o.regard) * proche) - haut);
  }
  function peindre() {
    if (!L) return; const l = borne(e.l, 0, L);
    trace.style.strokeDashoffset = f(L - l);
    if (objet) { const p = table[Math.min(table.length - 1, Math.round(l / pas))]; objet.setAttribute('transform', `translate(${f(p[1])} ${f(p[2])})`); objet.classList.toggle('est-visible', l > 2 && l < L - 2); }
    for (const a of ancres) { const ok = l >= a.l - 1; if (ok !== a.ok) { a.ok = ok; a.e.classList.toggle('est-atteinte', ok); a.perle?.classList.toggle('est-atteinte', ok); } }
  }
  function construire() {
    const W = root.clientWidth, H = root.clientHeight; if (!W || !H) return;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const rr = root.getBoundingClientRect(); haut = rr.top + scrollY; maxScroll = document.documentElement.scrollHeight - innerHeight;
    const tel = innerWidth < o.largeurTelephone;
    const boite = (x) => { const h = x.parentElement?.classList.contains('pin-spacer') ? x.parentElement : x; const r = h.getBoundingClientRect(); return { l: r.left - rr.left, t: r.top - rr.top, r: r.right - rr.left, b: r.bottom - rr.top, w: r.width, h: r.height }; };
    const gout = (x) => { const c = x.matches(o.cadre) ? x : x.querySelector(o.cadre); if (!c) return [16, 16]; const b = boite(c); return [b.l, W - b.r]; };
    const xCote = (x, cote) => { const [g, d] = gout(x); return cote === 'droite' ? W - Math.max(6, d * o.marge) : Math.max(6, g * o.marge); };
    const visible = (x) => x.getClientRects().length > 0;
    let pts = [];
    const accroches = $$('[data-fil], [data-fil-point], [data-fil-repere]', root).filter(visible);
    for (const x of accroches) {
      const b = boite(x);
      if (x.hasAttribute('data-fil-point')) { const [fx = .5, fy = .5] = (x.dataset.filPoint || '').trim().split(/\s+/).map(Number); pts.push({ x: b.l + b.w * fx, y: b.t + b.h * fy, el: x }); }
      else if (x.hasAttribute('data-fil')) {
        const cs = getComputedStyle(x), xx = xCote(x, x.dataset.fil || 'gauche');
        const iT = Math.min(Math.max((parseFloat(cs.paddingTop) || 0) * .5, 24), b.h * .25), iB = Math.min(Math.max((parseFloat(cs.paddingBottom) || 0) * .5, 24), b.h * .25);
        pts.push({ x: xx, y: b.t + iT, el: x, debut: true }, { x: xx, y: b.b - iB, el: x, fin: true });
      }
    }
    pts.sort((a, b) => a.y - b.y);
    if (pts.length < 2) { trace.setAttribute('d', ''); rail.setAttribute('d', ''); L = 0; return; }
    let onde = o.onde;
    if (tel) { const x0 = Math.max(6, gout(accroches.find((x) => x.hasAttribute('data-fil')) || root)[0] * o.marge); pts = pts.map((p) => ({ ...p, x: x0 })); onde = 0; }
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`, cur = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const b = pts[i], dy = b.y - cur.y;
      if (Math.abs(b.x - cur.x) < 1) {
        if (onde && cur.debut && b.fin && cur.el === b.el && dy > 80) { const k = cur.x < W / 2 ? 1 : -1; d += ` C${f(cur.x + onde * k)} ${f(cur.y + dy / 3)} ${f(b.x - onde * k)} ${f(cur.y + dy * 2 / 3)} ${f(b.x)} ${f(b.y)}`; }
        else d += ` L${f(b.x)} ${f(b.y)}`;
      } else d += ` C${f(cur.x)} ${f(cur.y + dy * .55)} ${f(b.x)} ${f(b.y - dy * .55)} ${f(b.x)} ${f(b.y)}`;
      cur = b;
    }
    trace.setAttribute('d', d); rail.setAttribute('d', d);
    L = trace.getTotalLength(); trace.style.strokeDasharray = `${L} ${L}`;
    pas = Math.max(8, L / 520); table = []; let maxY = -Infinity;
    for (let l = 0; ; l += pas) { const ll = Math.min(l, L), p = trace.getPointAtLength(ll); maxY = Math.max(maxY, p.y); table.push([ll, p.x, p.y, maxY]); if (ll >= L) break; }
    gPerles.replaceChildren(); ancres = [];
    for (const x of accroches) {
      if (!x.hasAttribute('data-fil-repere')) continue;
      const b = boite(x), l = longueurPourY(b.t + b.h / 2), q = table[Math.min(table.length - 1, Math.round(l / pas))];
      const perle = el('circle', 'fic__perle', gPerles); perle.setAttribute('r', tel ? 3.5 : 4.5); perle.setAttribute('cx', f(q[1])); perle.setAttribute('cy', f(q[2]));
      ancres.push({ e: x, l, perle, ok: null });
    }
    gsap.killTweensOf(e); e.l = calme ? L : cible(); peindre();
  }
  const suivre = () => { if (calme || !L) return; gsap.to(e, { l: cible(), duration: o.lissage, ease: 'power3.out', overwrite: true, onUpdate: peindre }); };
  /* Construit après l'ouverture (leçon alexandra-grandry : jamais de calcul lourd pendant l'intro). */
  const lancer = () => { ST.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: suivre, onRefresh: construire }); construire(); rafraichir(); };
  if (etat.pret) lancer(); else quand('pret', lancer);
}

/* ================= LIASSE : épreuves empilées (module planches-empilees, positions gardées) ================= */
export function liasse() {
  const root = $('.ple'); if (!root) return;
  const pile = $('.ple__pile', root), planches = $$('.ple__planche', root);
  if (planches.length < 2) return;
  root.style.setProperty('--ple-n', planches.length);
  const empile = () => getComputedStyle(planches[0]).position === 'sticky';
  let hauts = [], naturels = [], hp = 0, basPile = 0, actif = false;
  function verifier() {
    root.classList.remove('ple--plat');
    planches.forEach((p) => { p.style.setProperty('--ple-p', 0); });
    actif = empile();
    if (actif) {
      const deborde = planches.some((p) => { const c = $('.ple__contenu', p); return p.scrollHeight > p.clientHeight + 1 || (c && c.scrollHeight > c.clientHeight + 1); });
      root.classList.toggle('ple--plat', deborde); actif = !deborde;
    }
    hauts = planches.map((p) => parseFloat(getComputedStyle(p).top) || 0);
    const r = pile.getBoundingClientRect(), gap = parseFloat(getComputedStyle(pile).rowGap) || 0;
    hp = planches[0].offsetHeight;
    naturels = planches.map((_, i) => r.top + scrollY + i * (hp + gap));
    basPile = r.bottom + scrollY;
    maj();
  }
  function maj() {
    if (!actif) { planches.forEach((p) => p.classList.remove('est-epingle')); return; }
    const h = innerHeight, y = scrollY;
    const q = naturels.map((n, j) => j === 0 ? 0 : borne((h - (n - y)) / Math.max(1, h - hauts[j]), 0, 1));
    planches.forEach((p, i) => {
      let prof = 0; for (let j = i + 1; j < q.length; j++) prof += q[j];
      p.style.setProperty('--ple-p', Math.min(3, prof).toFixed(3));
      const colle = naturels[i] - y <= hauts[i] + 1.5 && basPile - y > hauts[i] + hp + 1;
      p.classList.toggle('est-epingle', colle);
    });
  }
  let id = 0; const demander = () => { if (!id) id = requestAnimationFrame(() => { id = 0; maj(); }); };
  addEventListener('scroll', demander, { passive: true });
  if (ST) ST.addEventListener('refresh', verifier); else addEventListener('resize', verifier);
  verifier();
}

/* ================= IMPOSITION : feuilles dispersées qui se calent en grille ================= */
export function imposition() {
  $$('[data-imposition]').forEach((grille, gi) => {
    const items = [...grille.children];
    let graine = 7 + gi * 13; const alea = () => { graine = (graine * 9301 + 49297) % 233280; return graine / 233280; };
    const depart = items.map(() => ({ x: (alea() - .5) * 1.3, y: .25 + alea() * .55, r: (alea() - .5) * 26 }));
    items.forEach((it) => it.setAttribute('data-superpose', ''));
    const poser = (p) => {
      const k = 1 - lisse(borne(p, 0, 1)), cale = lisse(borne((p - .8) / .2, 0, 1));
      items.forEach((it, i) => {
        const w = it.__w || 200, h = it.__h || 200, d = depart[i];
        it.style.setProperty('--fx', `${(d.x * w * k).toFixed(1)}px`); it.style.setProperty('--fy', `${(d.y * h * k).toFixed(1)}px`);
        it.style.setProperty('--fr', `${(d.r * k).toFixed(2)}deg`); it.style.setProperty('--cale', cale.toFixed(2));
      });
    };
    const mesurer = () => items.forEach((it) => { it.__w = it.offsetWidth; it.__h = it.offsetHeight; });
    if (etat.calme || !ST) { poser(1); return; }
    mesurer(); poser(0);
    ST.create({ trigger: grille, start: 'top 92%', end: etroit() ? 'top 35%' : 'top 30%', onUpdate: (st) => poser(st.progress), onRefresh: (st) => { mesurer(); poser(st.progress); } });
  });
}

/* ================= ÉTAPES : chaque étape s'allume quand la feuille l'atteint ================= */
export function etapes() {
  $$('[data-etape]').forEach((el) => {
    if (etat.calme || !ST) { el.classList.add('est-atteinte'); return; }
    ST.create({ trigger: el, start: 'top 62%', onToggle: (st) => el.classList.toggle('est-atteinte', st.isActive || st.progress > 0), end: 'max' });
  });
}

/* ================= SÉCHOIR : tirages suspendus qui se balancent avec la vitesse du défilement ================= */
export function sechoir() {
  const zone = $('.sechoir'); if (!zone || etat.calme) return;
  const tirages = $$('.tirage', zone).map((el, i) => ({ el, a: 0, v: 0, k: 26 + (i % 4) * 4, phase: i % 2 ? -1 : 1 }));
  boucle(zone, (dt) => {
    const pousse = borne(vitesse.v / 260, -9, 9);
    tirages.forEach((t) => {
      const acc = -t.k * (t.a - pousse * t.phase * .8) - 3.2 * t.v;
      t.v += acc * dt; t.a += t.v * dt;
      if (Math.abs(t.a) < .01 && Math.abs(t.v) < .01 && Math.abs(pousse) < .01) { t.a = 0; t.v = 0; }
      t.el.style.setProperty('--balance', `${t.a.toFixed(2)}deg`);
    });
  });
}

/* ================= Scrub générique d'une variable CSS ================= */
export function scrubVar(el, nom, de, a, unite, opts = {}) {
  if (!el) return;
  const poser = (p) => el.style.setProperty(nom, `${(de + (a - de) * p).toFixed(2)}${unite}`);
  if (etat.calme || !ST) { poser(opts.calme ?? 1); return; }
  poser(0);
  ST.create({ trigger: opts.trigger || el, start: opts.start || 'top top', end: opts.end || 'bottom top', onUpdate: (st) => poser(st.progress), onRefresh: (st) => poser(st.progress) });
}

/* ================= ENVELOPPE : l'envoi avance d'étape en étape (publipostage) ================= */
export function enveloppe() {
  const env = $('.enveloppe'), zone = $('[data-etapes]'); if (!env || !zone) return;
  const poser = (p) => {
    const x = Math.sin(p * Math.PI * 2) * 18 + (p > .82 ? (p - .82) / .18 * 60 : 0);
    env.style.setProperty('--ex', `${x.toFixed(1)}px`);
    env.style.setProperty('--ey', `${(Math.cos(p * Math.PI * 3) * 8).toFixed(1)}px`);
    env.style.setProperty('--er', `${((p - .5) * -14).toFixed(2)}deg`);
  };
  if (etat.calme || !ST) { poser(.5); return; }
  poser(0);
  ST.create({ trigger: zone, start: 'top 80%', end: 'bottom 45%', onUpdate: (st) => poser(st.progress), onRefresh: (st) => poser(st.progress) });
}

/* ================= BOOST : titres de section imprimés en quatre passages à leur arrivée ================= */
export function titresQuadri() {
  if (etat.calme || !gsap || !ST) return;
  $$('.titre-section').forEach((el) => {
    el.classList.add('quadri');
    el.style.setProperty('--qx', '9px'); el.style.setProperty('--qy', '5px');
    ST.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => gsap.to(el, { '--qx': '0px', '--qy': '0px', duration: 1.1, delay: .25, ease: 'power3.out' }) });
  });
}

/* ================= BOOST : gouttes d'encre quand on lâche le repère lancé fort ================= */
export function gouttes(canvas, oat) {
  if (!canvas || !oat || etat.calme) return { lancer() {} };
  const ctx = canvas.getContext('2d');
  const couleurs = ['rgba(10,156,198,', 'rgba(200,34,127,', 'rgba(240,194,26,', 'rgba(23,22,27,'];
  let liste = [], W = 0, H = 0, dpr = 1, actif = false;
  const mesurer = () => { const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 1.5); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); };
  mesurer(); addEventListener('resize', mesurer);
  let dernier = 0;
  const pas = (t) => {
    const dt = Math.min(.05, dernier ? (t - dernier) / 1000 : 1 / 60); dernier = t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    liste = liste.filter((g) => g.vie > 0);
    for (const g of liste) {
      if (!g.pose) { g.vx *= Math.exp(-dt * 2.2); g.vy = g.vy * Math.exp(-dt * 2.2) + 900 * dt; g.x += g.vx * dt; g.y += g.vy * dt; g.t += dt; if (g.t > g.duree) { g.pose = true; } }
      else { g.vie -= dt / 1.6; g.r += dt * 1.6; }
      ctx.fillStyle = g.c + (.85 * Math.min(1, g.vie)).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(g.x, g.y, g.r * (g.pose ? 1.25 : 1), g.r, g.a, 0, Math.PI * 2); ctx.fill();
    }
    if (liste.length && !document.hidden) requestAnimationFrame(pas); else { actif = false; dernier = 0; ctx.clearRect(0, 0, W, H); canvas.classList.remove('actif'); }
  };
  return {
    lancer(force, angle) {
      const ro = oat.getBoundingClientRect(), rc = canvas.getBoundingClientRect();
      const cx = ro.left + ro.width / 2 - rc.left, cy = ro.top + ro.height / 2 - rc.top, R = ro.width / 2;
      const n = Math.min(36, 10 + Math.round(Math.abs(force) * 1.4));
      for (let i = 0; i < n; i++) {
        const a = angle + (i / n) * Math.PI * 2 + Math.random() * .4, sens = Math.sign(force) || 1;
        const v = 260 + Math.random() * 520 * Math.min(1, Math.abs(force) / 18);
        liste.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, vx: -Math.sin(a) * v * sens, vy: Math.cos(a) * v * sens - 120, r: 2.5 + Math.random() * 6, a: Math.random() * 3, c: couleurs[i % 4], t: 0, duree: .35 + Math.random() * .5, vie: 1, pose: false });
      }
      canvas.classList.add('actif');
      if (!actif) { actif = true; requestAnimationFrame(pas); }
    },
  };
}
