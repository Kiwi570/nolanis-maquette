/* Effets des pages intérieures de Nolanis : dépliant (Print & Web), chemin de fer (Publicité),
   table lumineuse, compte-fils, planche contact et montage (Photo & vidéo), devis et tampon BON À TIRER (Contact). */
import { boucle, etat, rafraichir, suivre, lacher } from './socle/index.js?v=3';
import { etroit, scrubVar } from './effets-nolanis.js?v=3';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const borne = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Print & Web : le dépliant s'ouvre volet par volet ---------- */
export function depliant() {
  const scene = $('.depliant-scene'); if (!scene) return;
  const volets = $$('.volet', scene);
  const g = volets[0], d = volets[2], m = volets[1];
  const poser = (p) => {
    const a = borne(p * 1.25, 0, 1), b = borne(p * 1.25 - .25, 0, 1);
    if (!etroit()) {
      g.style.transform = `rotateY(${(-172 * (1 - a)).toFixed(1)}deg)`; g.style.setProperty('--pli', (.35 * (1 - a)).toFixed(3));
      d.style.transform = `rotateY(${(172 * (1 - b)).toFixed(1)}deg)`; d.style.setProperty('--pli', (.35 * (1 - b)).toFixed(3));
      m.style.setProperty('--pli', (.2 * (1 - b)).toFixed(3));
    }
  };
  const final = () => volets.forEach((v) => { v.style.transform = ''; v.style.removeProperty('--pli'); });
  if (etat.calme || !ST || !gsap) { final(); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
      poser(0);
      const st = ST.create({ trigger: scene, start: 'top top', end: '+=150%', pin: $('.ecran-interieur', scene), onUpdate: (s) => poser(s.progress), onRefresh: (s) => poser(s.progress), onToggle: (s) => scene.classList.toggle('est-epingle', s.isActive) });
      return () => { st.kill(); final(); };
  });
  mm.add('(max-width: 760px)', () => {
      const sts = volets.map((v) => {
        let max = 0;
        const p = (x) => { max = Math.max(max, x); v.style.transform = max >= 1 ? '' : `perspective(900px) rotateX(${(-70 * (1 - max)).toFixed(1)}deg)`; v.style.setProperty('--pli', (.3 * (1 - max)).toFixed(3)); };
        p(0);
        return ST.create({ trigger: v, start: 'top 95%', end: 'top 55%', onUpdate: (s) => p(s.progress), onRefresh: (s) => p(s.progress) });
      });
      return () => { sts.forEach((s) => s.kill()); final(); };
  });
}

/* ---------- Publicité : chemin de fer, chaque emplacement s'allume à son tour ---------- */
export function cheminDeFer() {
  const scene = $('.chemin-scene'); if (!scene) return;
  const cases = $$('.emplacement', scene);
  const activer = (i) => cases.forEach((c, j) => c.classList.toggle('est-active', j === i));
  if (etat.calme || !ST || !gsap) { activer(-1); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
      const st = ST.create({ trigger: scene, start: 'top top', end: '+=180%', pin: $('.ecran-interieur', scene), onUpdate: (s) => activer(Math.min(cases.length - 1, Math.floor(s.progress * cases.length))), onToggle: (s) => scene.classList.toggle('est-epingle', s.isActive) });
      activer(0);
      return () => { st.kill(); activer(-1); };
  });
  mm.add('(max-width: 760px)', () => {
      const sts = cases.map((c) => ST.create({ trigger: c, start: 'center 56%', end: 'center 44%', onToggle: (s) => c.classList.toggle('est-active', s.isActive) }));
      return () => sts.forEach((s) => s.kill());
  });
}

/* ---------- Photo & vidéo : compte-fils sur la bande de photos qui défile ---------- */
export function compteFils() {
  const table = $('.table-lumineuse'); if (!table) return;
  const loupe = $('.compte-fils', table), zoom = $('.compte-fils-zoom', loupe), bande = $('.bande', table);
  const copie = bande.cloneNode(true); copie.removeAttribute('id');
  $$('[id]', copie).forEach((x) => x.removeAttribute('id'));
  $$('img', copie).forEach((x) => { x.alt = ''; x.loading = 'eager'; });
  copie.setAttribute('aria-hidden', 'true'); zoom.appendChild(copie);
  const pisteO = $('.bande-piste', bande), pisteC = $('.bande-piste', copie);
  let T = { w: 0, h: 0 }, R = 0, pos = { x: .62, y: .5 };
  const ECH = 2.2;
  const placer = () => {
    const cx = pos.x * T.w, cy = pos.y * T.h;
    loupe.style.setProperty('--lx', `${cx}px`); loupe.style.setProperty('--ly', `${cy}px`);
    zoom.style.width = `${T.w}px`; zoom.style.height = `${T.h}px`;
    zoom.style.transform = `translate(${(R - cx).toFixed(1)}px, ${(R - cy).toFixed(1)}px)`;
    copie.style.transformOrigin = `${cx}px ${cy}px`;
    copie.style.transform = `translateY(-50%) scale(${ECH})`;
  };
  const mesurer = () => { T = { w: table.clientWidth, h: table.clientHeight }; R = loupe.offsetWidth / 2; pos.x = borne(pos.x, R / T.w, 1 - R / T.w); pos.y = borne(pos.y, R / T.h, 1 - R / T.h); placer(); };
  mesurer(); addEventListener('resize', mesurer);
  /* Glisser la loupe (souris ou doigt), ou flèches du clavier. */
  let tenu = null, dep = null;
  loupe.addEventListener('pointerdown', (e) => { tenu = e.pointerId; loupe.setPointerCapture(tenu); const r = table.getBoundingClientRect(); dep = { r }; e.preventDefault(); });
  loupe.addEventListener('pointermove', (e) => { if (tenu !== e.pointerId) return; const r = dep.r; pos.x = borne((e.clientX - r.left) / T.w, R / T.w, 1 - R / T.w); pos.y = borne((e.clientY - r.top) / T.h, R / T.h, 1 - R / T.h); placer(); });
  const fin = (e) => { if (tenu === e.pointerId) tenu = null; };
  loupe.addEventListener('pointerup', fin); loupe.addEventListener('pointercancel', fin);
  loupe.addEventListener('keydown', (e) => {
    const d = { ArrowLeft: [-.04, 0], ArrowRight: [.04, 0], ArrowUp: [0, -.06], ArrowDown: [0, .06] }[e.key]; if (!d) return;
    e.preventDefault(); pos.x = borne(pos.x + d[0], R / T.w, 1 - R / T.w); pos.y = borne(pos.y + d[1], R / T.h, 1 - R / T.h); placer();
  });
  /* La copie agrandie suit exactement la bande (même animation, même instant, même pause). */
  if (etat.calme) return;
  boucle(table, () => {
    const a = pisteO.getAnimations()[0], b = pisteC.getAnimations()[0];
    if (!a || !b) return;
    if (a.playState !== b.playState) { if (a.playState === 'paused') b.pause(); else b.play(); }
    b.currentTime = a.currentTime;
  });
}

/* ---------- Planche contact : filtres, crayon gras, visionneuse ---------- */
export function planche() {
  const zone = $('#planche'); if (!zone) return;
  const grille = $('.planche', zone), vignettes = $$('.vignette', grille), boutons = $$('.filtre', zone);
  const compte = $('[data-compte]', zone), crayon = $('.crayon', grille), trait = crayon ? $('path', crayon) : null;
  let visibles = vignettes;
  /* Crayon gras : il entoure une photo, puis la suivante au fil du défilement. */
  let positions = [], cibleActuelle = -1, L = 0;
  const mesurer = () => { positions = visibles.map((v) => ({ x: v.offsetLeft, y: v.offsetTop, w: v.offsetWidth, h: v.offsetHeight })); };
  const entourer = (i, instant) => {
    if (!trait || !positions.length) return;
    i = borne(i, 0, positions.length - 1); if (i === cibleActuelle && !instant) return; cibleActuelle = i;
    const p = positions[i], cx = p.x + p.w / 2, cy = p.y + p.h / 2, rx = p.w * .62, ry = p.h * .58;
    trait.setAttribute('d', `M${cx - rx * .2} ${cy - ry} C ${cx + rx * 1.1} ${cy - ry * 1.15}, ${cx + rx * 1.12} ${cy + ry * 1.05}, ${cx} ${cy + ry} S ${cx - rx * 1.15} ${cy + ry * .1}, ${cx - rx * .9} ${cy - ry * .45} S ${cx + rx * .1} ${cy - ry * 1.12}, ${cx + rx * .5} ${cy - ry * .9}`);
    L = trait.getTotalLength(); trait.style.strokeDasharray = `${L} ${L}`;
    if (etat.calme || instant || !gsap) { trait.style.strokeDashoffset = '0'; return; }
    gsap.fromTo(trait, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: .6, ease: 'power2.out', overwrite: true });
  };
  const sequence = () => { const n = visibles.length; return Array.from({ length: Math.min(6, n) }, (_, k) => Math.floor((k * n) / Math.min(6, n))); };
  if (ST && !etat.calme) {
    ST.create({ trigger: grille, start: 'top 70%', end: 'bottom 40%', onUpdate: (s) => { const seq = sequence(); entourer(seq[Math.min(seq.length - 1, Math.floor(s.progress * seq.length))]); }, onRefresh: () => { mesurer(); const c = cibleActuelle; cibleActuelle = -1; entourer(Math.max(0, c), true); } });
  }
  const appliquer = (cat, maj = true) => {
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === cat)));
    const faire = () => {
      vignettes.forEach((v) => { v.hidden = !(cat === 'tout' || v.dataset.cat === cat); });
      visibles = vignettes.filter((v) => !v.hidden);
      if (compte) compte.textContent = compte.dataset.modele.replace('{n}', visibles.length);
      mesurer(); cibleActuelle = -1; entourer(0, true);
      grille.classList.remove('change'); rafraichir();
    };
    if (maj) {
      const u = new URL(location.href); if (cat === 'tout') u.searchParams.delete('sujet'); else u.searchParams.set('sujet', cat);
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
      grille.classList.add('change'); setTimeout(faire, etat.calme ? 0 : 220);
    } else faire();
  };
  boutons.forEach((b) => b.addEventListener('click', () => appliquer(b.dataset.filtre)));
  const depart = new URLSearchParams(location.search).get('sujet');
  appliquer(boutons.some((b) => b.dataset.filtre === depart) ? depart : 'tout', false);

  /* Visionneuse : ouverte depuis la vignette, flèches, glissement, Échap ; lien propre à chaque photo (#photo-12). */
  const v = $('.visionneuse'); if (!v) return;
  const img = $('img', v), legende = $('figcaption', v);
  let courant = -1, retour = null;
  const montrer = (i) => {
    const liste = visibles; if (!liste.length) return;
    courant = (i + liste.length) % liste.length; const el = liste[courant];
    img.src = `/assets/images/photos/p${el.dataset.n}-600.webp`; img.alt = el.dataset.alt; legende.textContent = el.dataset.alt;
    history.replaceState(history.state, '', `${location.pathname}${location.search}#photo-${el.dataset.n}`);
  };
  const ouvrir = (i, depuis) => { retour = depuis || document.activeElement; montrer(i); v.classList.add('ouverte'); v.setAttribute('aria-hidden', 'false'); suivre(v); document.documentElement.classList.add('defilement-bloque'); $('.v-fermer', v).focus(); };
  const fermer = () => { v.classList.remove('ouverte'); v.setAttribute('aria-hidden', 'true'); lacher(v); document.documentElement.classList.remove('defilement-bloque'); history.replaceState(history.state, '', location.pathname + location.search); retour && retour.focus && retour.focus(); };
  vignettes.forEach((el) => el.addEventListener('click', () => ouvrir(visibles.indexOf(el), el)));
  $('.v-fermer', v).addEventListener('click', fermer);
  $('.v-prec', v).addEventListener('click', () => montrer(courant - 1));
  $('.v-suiv', v).addEventListener('click', () => montrer(courant + 1));
  v.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); fermer(); }
    else if (e.key === 'ArrowLeft') montrer(courant - 1); else if (e.key === 'ArrowRight') montrer(courant + 1);
    else if (e.key === 'Tab') { const f = $$('button', v); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  let x0 = null;
  v.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  v.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) montrer(courant + (dx < 0 ? 1 : -1)); });
  const m = location.hash.match(/^#photo-(\d+)$/);
  if (m) { const el = vignettes.find((x) => x.dataset.n === m[1].padStart(2, '0')); if (el) { if (el.hidden) appliquer('tout', false); setTimeout(() => ouvrir(visibles.indexOf(el), el), 400); } }
}

/* ---------- Montage vidéo : tête de lecture et timecode pilotés par le défilement (illustratif) ---------- */
export function montage() {
  const el = $('.montage'); if (!el) return;
  const tete = $('.tete-lecture', el), tc = $('.timecode', el), piste = $('.clips', el);
  let w = 0;
  const poser = (p) => {
    tete.style.setProperty('--tl', `${(p * w).toFixed(1)}px`);
    const s = p * 45, sec = Math.floor(s), im = Math.floor((s - sec) * 25);
    tc.textContent = `00:00:${String(sec).padStart(2, '0')}:${String(im).padStart(2, '0')}`;
  };
  const mesurer = () => { w = piste.offsetWidth; };
  mesurer();
  if (etat.calme || !ST) { poser(1); return; }
  poser(0);
  ST.create({ trigger: el, start: 'top 85%', end: 'bottom 25%', onUpdate: (s) => poser(s.progress), onRefresh: (s) => { mesurer(); poser(s.progress); } });
}

/* ---------- Contact : devis en trois étapes, récapitulatif en épreuve, tampon BON À TIRER ---------- */
export function devis() {
  const f = $('[data-devis]'); if (!f) return;
  const etapesF = $$('.etape-form', f), puces = $$('.devis-etapes li');
  const epreuve = $('.epreuve'), tampon = $('.tampon-bat'), msg = $('[data-message-envoi]', f);
  const supports = JSON.parse(f.dataset.supports || '{}');
  const champSupport = f.elements.support;
  if (champSupport && supports[champSupport.value]) champSupport.value = supports[champSupport.value];
  const rv = { service: $('[data-recap="service"]'), support: $('[data-recap="support"]'), delai: $('[data-recap="delai"]') };
  const vide = epreuve?.dataset.vide || '';
  const recap = () => {
    const s = f.querySelector('input[name="service"]:checked');
    rv.service.textContent = s ? s.dataset.nom : vide;
    rv.support.textContent = (champSupport?.value || '').trim() || vide;
    const d = f.elements.delai; rv.delai.textContent = d && d.value ? d.options[d.selectedIndex].text : vide;
  };
  f.addEventListener('input', recap); f.addEventListener('change', recap); recap();
  let n = 0;
  const aller = (i, focus = true) => {
    n = borne(i, 0, etapesF.length - 1);
    etapesF.forEach((e, j) => { e.hidden = j !== n; });
    puces.forEach((p, j) => { p.classList.toggle('active', j === n); p.classList.toggle('faite', j < n); if (j === n) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
    const cible = etapesF[n];
    if (gsap && !etat.calme && focus) gsap.fromTo(cible, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .45, ease: 'power3.out', clearProps: 'transform,opacity' });
    if (focus) { const champ = cible.querySelector('input:not([type="hidden"]), select, textarea'); champ && champ.focus({ preventScroll: true }); }
    rafraichir();
  };
  const erreur = $('[data-erreur-choix]', f);
  $$('[data-suivant]', f).forEach((b) => b.addEventListener('click', () => {
    if (n === 0 && !f.querySelector('input[name="service"]:checked')) { erreur.hidden = false; f.querySelector('input[name="service"]').focus(); return; }
    erreur.hidden = true; aller(n + 1);
  }));
  $$('[data-precedent]', f).forEach((b) => b.addEventListener('click', () => aller(n - 1)));
  $$('[data-modifier]').forEach((b) => b.addEventListener('click', () => aller(0)));
  /* Choix déjà fait depuis un autre bouton (?service=…) : on commence à l'étape du projet. */
  aller(new URLSearchParams(location.search).get('service') && f.querySelector('input[name="service"]:checked') ? 1 : 0, false);
  /* Envoi : le socle vérifie les champs ; s'il accepte (bouton désactivé), l'épreuve est tamponnée et file dans la bannette. */
  f.addEventListener('submit', () => {
    const b = f.querySelector('[type="submit"]');
    requestAnimationFrame(() => {
      if (!b.disabled) { const premier = f.querySelector('[aria-invalid="true"]'); if (premier) { const k = etapesF.findIndex((e) => e.contains(premier)); if (k >= 0 && k !== n) { aller(k); premier.focus(); } } return; }
      recap();
      if (etat.calme || !gsap) { epreuve.classList.add('tamponnee'); return; }
      gsap.timeline()
        .fromTo(tampon, { opacity: 0, scale: 2.2, rotation: -24 }, { opacity: .94, scale: 1, rotation: -14, duration: .32, ease: 'power4.in' })
        .add(() => epreuve.classList.add('tamponnee'))
        .fromTo(epreuve, { y: 0 }, { y: 6, duration: .08, yoyo: true, repeat: 1, ease: 'power1.inOut' })
        .to(epreuve, { y: 28, rotation: 1.6, scale: .97, duration: .7, ease: 'power3.inOut' }, '+=.45')
        .to(epreuve, { y: 0, rotation: 0, scale: 1, duration: .5, ease: 'power3.out' }, '+=.3');
    });
  });
}

/* ---------- Petits mouvements liés au défilement (variables CSS) ---------- */
export function mouvementsPages() {
  const ouv = $('.op-print');
  if (ouv) scrubVar($('.volet-f--couverture'), '--ouvre', -28, -150, 'deg', { trigger: ouv, start: 'top top', end: 'bottom 35%', calme: 0 });
  const pub = $('.op-pub');
  if (pub) { scrubVar($('.couverture'), '--rot', 6, -3, 'deg', { trigger: pub, start: 'top top', end: 'bottom top', calme: .3 }); scrubVar($('.couverture'), '--ty', 0, -60, 'px', { trigger: pub, start: 'top top', end: 'bottom top', calme: 0 }); }
  const ct = $('.op-contact');
  if (ct) scrubVar($('.tampon'), '--rot', -10, 14, 'deg', { trigger: ct, start: 'top top', end: 'bottom top', calme: 0 });
  const fp = $('.fin-planche');
  if (fp) scrubVar($('.fin-loupe'), '--lx', 2, 64, '%', { trigger: fp, start: 'top 90%', end: 'bottom 30%', calme: .5 });
  const bon = $('.bon-reservation');
  if (bon) { scrubVar($('.bon-tampon'), '--o', 0, 1, '', { trigger: bon, start: 'top 85%', end: 'top 50%' }); scrubVar($('.bon-tampon'), '--s', 1.8, 1, '', { trigger: bon, start: 'top 85%', end: 'top 50%' }); }
  const p404 = $('.op-404');
  if (p404) scrubVar($('.op-404 .repere'), '--r', 0, 1, '', { trigger: p404 });
}
