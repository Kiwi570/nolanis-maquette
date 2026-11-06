/* Effets des quatre pages de la v2 : Publipostage (cachet, parcours de l'enveloppe, délai, e-mailing),
   Objets publicitaires (impression en direct, envol vers le bouton Devis, présentoir à feuilleter),
   Sauvegarde (cadenas, barre incrémentale, trajet d'un fichier, test de panne),
   Formations (mise au point du viseur, molette de mode crantée). */
import { etat, rafraichir } from './socle/index.js?v=3';
import { etroit, scrubVar } from './effets-nolanis.js?v=3';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const borne = (v, a, b) => Math.max(a, Math.min(b, v));
const lisse = (a, b, x) => { const t = borne((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const visible = (el) => el && el.offsetParent !== null && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden';

/* ================= PUBLIPOSTAGE ================= */

/* L'enveloppe traverse les cinq étapes : la feuille se pose, les encres, la mise sous pli, puis l'envoi. */
export function poste() {
  const scene = $('.poste-scene'); if (!scene) return;
  const lignes = $$('.poste-etape', scene), visuel = $('.poste-visuel', scene);
  const env = $('.env--scene', scene), feuille = $('.poste-feuille', scene), nuancier = $('.poste-nuancier', scene);
  const n = lignes.length;
  const poser = (p) => {
    const i = Math.min(n - 1, Math.floor(p * n));
    lignes.forEach((l, j) => l.classList.toggle('est-atteinte', j <= i));
    const k = p * n; /* 0 à 5 */
    /* Le support : la feuille se pose ; la conception : elle s'imprime, le nuancier sort ;
       la mise sous pli : elle file vers l'enveloppe et y entre ; l'envoi : l'enveloppe part. */
    const vers = lisse(3, 3.55, k);
    feuille.style.setProperty('--fo', (lisse(.7, 1.3, k) * (1 - lisse(3.4, 3.6, k))).toFixed(3));
    feuille.style.setProperty('--fx', `${(vers * visuel.clientWidth * .3).toFixed(1)}px`);
    feuille.style.setProperty('--fy', `${(-30 * (1 - lisse(.7, 1.5, k)) + vers * visuel.clientHeight * .12).toFixed(1)}px`);
    feuille.style.setProperty('--fr', `${(-7 + vers * 7).toFixed(2)}deg`);
    feuille.style.setProperty('--fs', (1 - vers * .25).toFixed(3));
    feuille.style.setProperty('--imp', lisse(2, 2.6, k).toFixed(3));
    nuancier.style.setProperty('--no', (lisse(1.9, 2.4, k) * (1 - lisse(3.2, 3.6, k))).toFixed(3));
    env.style.setProperty('--lo', (lisse(3.35, 3.55, k) * (1 - lisse(3.85, 4, k))).toFixed(3));
    env.style.setProperty('--lettre', `${(-46 + 56 * lisse(3.5, 3.95, k)).toFixed(1)}px`);
    const part = lisse(4.15, 4.95, k);
    env.style.setProperty('--ex', `${(part * (visuel.clientWidth * .7)).toFixed(1)}px`);
    env.style.setProperty('--ey', `${(Math.sin(k * 1.6) * 6 - part * 40).toFixed(1)}px`);
    env.style.setProperty('--er', `${(-4 + part * 18).toFixed(2)}deg`);
  };
  if (etat.calme || !ST || !gsap) { poser(.7); lignes.forEach((l) => l.classList.add('est-atteinte')); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const st = ST.create({ trigger: scene, start: 'top top', end: '+=200%', pin: $('.ecran-interieur', scene), onUpdate: (s) => poser(s.progress * .999), onRefresh: (s) => poser(s.progress * .999), onToggle: (s) => scene.classList.toggle('est-epingle', s.isActive) });
    return () => st.kill();
  });
  mm.add('(max-width: 760px)', () => {
    const st = ST.create({ trigger: visuel, start: 'top 85%', end: 'bottom 20%', onUpdate: (s) => poser(s.progress * .999), onRefresh: (s) => poser(s.progress * .999) });
    return () => st.kill();
  });
}

/* Délai : J+1, J+4 ou J+7. L'enveloppe file jusqu'à la boîte, plus ou moins vite ; le lien du devis suit le choix. */
export function delai() {
  const zone = $('[data-delai]'); if (!zone) return;
  const boutons = $$('[data-jour]', zone), env = $('.delai-env', zone), boite = $('.delai-boite', zone), route = $('.delai-route', zone);
  const lien = $('[data-delai-lien]'), etatTxt = $('[data-delai-etat]', zone);
  const gabarit = zone.dataset.choisi || '{d}';
  const vitesse = { 'J+1': .7, 'J+4': 1.3, 'J+7': 2 };
  const sauts = { 'J+1': 1, 'J+4': 4, 'J+7': 7 };
  let tl = null;
  const distance = () => {
    const r = route.getBoundingClientRect(), b = boite.getBoundingClientRect(), e = env.getBoundingClientRect();
    const x0 = e.left - (parseFloat(env.style.getPropertyValue('--dx')) || 0);
    return Math.max(0, b.left - x0 - e.width * .55 + (r.width ? 0 : 0));
  };
  const lancer = (d, anime = true) => {
    if (tl) tl.kill();
    const dx = distance();
    if (!anime || etat.calme || !gsap) { env.style.setProperty('--dx', `${dx.toFixed(1)}px`); env.style.setProperty('--dy', '0px'); boite.classList.add('recu'); return; }
    boite.classList.remove('recu');
    const o = { p: 0 }, nb = sauts[d];
    tl = gsap.timeline()
      .set(env, { '--dx': '0px', '--dy': '0px', '--dr': '0deg' })
      .to(o, { p: 1, duration: vitesse[d], ease: 'power1.inOut', onUpdate: () => {
        env.style.setProperty('--dx', `${(o.p * dx).toFixed(1)}px`);
        env.style.setProperty('--dy', `${(-Math.abs(Math.sin(o.p * Math.PI * nb)) * 26).toFixed(1)}px`);
        env.style.setProperty('--dr', `${(Math.sin(o.p * Math.PI * nb * 2) * 7).toFixed(2)}deg`);
      } })
      .add(() => { void boite.offsetWidth; boite.classList.add('recu'); });
  };
  const choisir = (b, anime = true) => {
    const d = b.dataset.jour;
    boutons.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    if (etatTxt) etatTxt.textContent = gabarit.replace('{d}', d);
    if (lien) { const u = new URL(lien.getAttribute('href'), location.href); u.searchParams.set('support', `Envoi en ${d}`); lien.setAttribute('href', u.pathname + u.search + u.hash); }
    lancer(d, anime);
  };
  boutons.forEach((b) => b.addEventListener('click', () => choisir(b)));
  const courant = () => boutons.find((b) => b.getAttribute('aria-pressed') === 'true') || boutons[1];
  if (etat.calme || !ST) { requestAnimationFrame(() => lancer(courant().dataset.jour, false)); return; }
  /* À l'arrivée dans la section, l'enveloppe fait le trajet du délai déjà choisi ; ensuite elle oscille au défilement. */
  ST.create({ trigger: route, start: 'top 75%', once: true, onEnter: () => lancer(courant().dataset.jour) });
  addEventListener('resize', () => { if (boite.classList.contains('recu') && !(tl && tl.isActive())) env.style.setProperty('--dx', `${distance().toFixed(1)}px`); });
}

/* ================= OBJETS PUBLICITAIRES ================= */

/* Votre nom imprimé dessus : le texte se met à jour en direct, arrive en quatre passages décalés qui se calent. */
export function essai() {
  const zone = $('[data-essai]'); if (!zone) return;
  const champ = $('#f-perso', zone), objets = $$('.essai-objet', zone), etatTxt = $('[data-essai-etat]', zone);
  const radios = $$('input[name="objet"]', zone), ajouter = $('[data-ajouter]', zone);
  const defaut = zone.dataset.defaut || '';
  const texte = () => (champ.value || '').trim() || defaut;
  let tw = null;
  const caler = (el) => {
    const t = $('[data-impression]', el); if (!t) return;
    if (etat.calme || !gsap) { t.style.setProperty('--qx', '0px'); return; }
    if (tw) tw.kill();
    t.style.setProperty('--qx', '5px');
    tw = gsap.to(t, { '--qx': '0px', duration: .7, ease: 'power3.out' });
  };
  const ajuster = (t) => {
    /* Le texte reste dans sa zone : on réduit la taille si le nom est long. */
    const n = t.textContent.length;
    t.style.fontSize = `${borne(22 - Math.max(0, n - 9) * 1.15, 12, 22).toFixed(1)}px`;
  };
  const imprimer = () => {
    const v = texte();
    $$('[data-impression]', zone).forEach((t) => { t.textContent = v; ajuster(t); });
    caler($('.essai-objet.est-choisi', zone));
  };
  champ.addEventListener('input', imprimer);
  radios.forEach((r) => r.addEventListener('change', () => {
    objets.forEach((o) => o.classList.toggle('est-choisi', o.dataset.objet === r.value));
    const el = $('.essai-objet.est-choisi', zone);
    if (gsap && !etat.calme) gsap.fromTo(el, { y: -26, rotation: -6, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
    caler(el);
  }));
  imprimer();
  /* Arrivée dans l'écran : première impression en quatre passages. */
  if (!etat.calme && ST) {
    const t0 = $('.essai-objet.est-choisi [data-impression]', zone);
    if (t0) { t0.style.setProperty('--qx', '9px'); ST.create({ trigger: zone, start: 'top 75%', once: true, onEnter: () => gsap.to(t0, { '--qx': '0px', duration: 1.1, ease: 'power3.out' }) }); }
  }
  /* Ajouter à ma demande : l'objet s'envole vers le bouton Devis visible, dont le lien prend l'objet et le texte. */
  ajouter.addEventListener('click', async () => {
    const r = radios.find((x) => x.checked) || radios[0];
    const nom = r.dataset.nom, v = texte();
    const support = `${nom} : ${v}`;
    const cibles = $$('[data-entete] .entete-actions .bouton, [data-barre-fixe] .bouton:not(.bouton--contour)');
    cibles.forEach((a) => { const u = new URL(a.getAttribute('href'), location.href); u.searchParams.set('service', 'objets'); u.searchParams.set('support', support); a.setAttribute('href', u.pathname + u.search + u.hash); });
    if (etatTxt) etatTxt.textContent = (zone.dataset.ajoute || '{o} {t}').replace('{o}', nom).replace('{t}', v);
    await envol($('.essai-objet.est-choisi svg', zone), cibles.find(visible));
  });
}

/* Envol (module envol-vers-le-panier, adapté) : une copie de l'objet file en arc jusqu'au bouton, qui rebondit. */
async function envol(depuis, cible) {
  if (!cible) return;
  const rebond = () => { cible.classList.remove('est-recu'); void cible.offsetWidth; cible.classList.add('est-recu'); setTimeout(() => cible.classList.remove('est-recu'), 650); };
  if (!depuis || etat.calme || !gsap) { rebond(); return; }
  const entete = cible.closest('[data-entete]');
  if (entete) document.documentElement.classList.remove('entete-cache');
  const a = depuis.getBoundingClientRect();
  if (a.width < 4 || a.bottom < 0 || a.top > innerHeight) { rebond(); return; }
  const d = Math.min(a.width, a.height) * .8;
  const vol = document.createElement('div');
  vol.className = 'envol'; vol.setAttribute('aria-hidden', 'true');
  vol.style.cssText = `left:${a.left + (a.width - d) / 2}px;top:${a.top + (a.height - d) / 2}px;width:${d}px;height:${d}px`;
  vol.appendChild(depuis.cloneNode(true));
  document.body.appendChild(vol);
  await new Promise((ok) => setTimeout(ok, entete ? 60 : 0));
  const z = cible.getBoundingClientRect();
  const dx = z.left + z.width / 2 - (a.left + a.width / 2), dy = z.top + z.height / 2 - (a.top + a.height / 2);
  const T = .85, echelle = Math.max(.08, 30 / d);
  await new Promise((ok) => {
    gsap.timeline({ onComplete: ok })
      .to(vol, { scale: .62, rotate: -12, duration: T * .28, ease: 'power2.out' }, 0)
      .to(vol, { x: dx, duration: T * .9, ease: 'power1.inOut' }, T * .15)
      .to(vol, { y: Math.min(dy, 0) - Math.max(60, innerHeight * .12), duration: T * .38, ease: 'power2.out' }, T * .15)
      .to(vol, { y: dy, duration: T * .52, ease: 'power2.in' }, T * .53)
      .to(vol, { scale: echelle, rotate: 220, duration: T * .75, ease: 'power2.in' }, T * .3)
      .to(vol, { opacity: 0, duration: T * .15 }, T * .97);
  });
  vol.remove();
  rebond();
}

/* Présentoir (module bac-a-feuilleter, adapté) : épinglé, chaque cran fait basculer l'objet de devant vers soi. */
export function presentoir() {
  const root = $('.baf'); if (!root) return;
  const pile = $('.baf__pile', root), cartes = $$('.baf__pochette', root), n = cartes.length;
  const num = $('[data-baf-num]', root), barre = $('.baf__progres span', root), bois = $('.baf__bois', root);
  if (n < 2 || etat.calme || !gsap || !ST) return;
  const o = { longueur: .45, lissage: 9, bascule: 64, profondeur: 4 };
  ['tabindex', 'role', 'aria-label'].forEach((a) => pile.removeAttribute(a));
  root.classList.add('est-actif');
  const cran = (x) => { const b = Math.floor(x); return Math.min(n - 1, b + lisse(.3, .7, x - b)); };
  let p = 0, cible = 0, devant = -1, actif = false;
  const rendre = () => {
    cartes.forEach((c, i) => {
      const k = i - p;
      let tr, op = 1, ombre = 0;
      if (k >= 0) {
        tr = `translate3d(0, ${(-k * 5.5).toFixed(2)}%, ${(-k * 70).toFixed(1)}px) rotateX(${Math.min(k, o.profondeur) * 3}deg)`;
        op = 1 - lisse(o.profondeur - .4, o.profondeur + .6, k);
        ombre = Math.min(.62, k * .2);
      } else {
        const t = Math.min(1, -k);
        tr = `translate3d(0, ${(t * 6).toFixed(2)}%, ${(t * 90).toFixed(1)}px) rotateX(${(-t * o.bascule).toFixed(2)}deg)`;
        op = 1 - lisse(.4, .88, t);
      }
      if (op <= .001) tr = `translate3d(0, ${k < 0 ? 8 : (-k * 5.5).toFixed(2)}%, 0)`;
      c.style.transform = tr;
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = String(k < -.12 ? 60 + i : n - i);
      c.style.setProperty('--baf-ombre', ombre.toFixed(3));
    });
    const i = Math.min(n - 1, Math.max(0, Math.round(p)));
    if (i !== devant) {
      devant = i;
      cartes.forEach((c, j) => c.classList.toggle('est-devant', j === i));
      if (cartes[i].dataset.teinte) root.style.setProperty('--baf-teinte', cartes[i].dataset.teinte);
      if (num) num.textContent = String(i + 1).padStart(2, '0');
    }
    if (barre) barre.style.transform = `scaleX(${(p / (n - 1)).toFixed(4)})`;
    if (bois) bois.style.transform = `translate(-50%, ${(Math.sin((p % 1) * Math.PI) * 4).toFixed(2)}px) rotate(${(Math.sin((p % 1) * Math.PI * 2) * .6).toFixed(2)}deg)`;
  };
  const pas = (t, dms) => {
    const dt = Math.min(.05, (dms || 16) / 1000);
    if (Math.abs(cible - p) < .0005) { p = cible; rendre(); gsap.ticker.remove(pas); actif = false; return; }
    p += (cible - p) * (1 - Math.exp(-dt * o.lissage));
    rendre();
  };
  const relancer = () => { if (!actif) { actif = true; gsap.ticker.add(pas); } };
  const st = ST.create({
    trigger: root, start: 'top top', end: () => '+=' + Math.round(innerHeight * o.longueur * (n - 1)),
    pin: true, invalidateOnRefresh: true,
    onUpdate: (x) => { cible = cran(x.progress * (n - 1)); relancer(); },
    onToggle: (x) => root.classList.toggle('est-epingle', x.isActive),
  });
  cible = p = cran(st.progress * (n - 1));
  rendre();
  /* Au clavier : l'objet qui reçoit le focus passe devant. */
  pile.addEventListener('focusin', (e) => {
    const i = cartes.findIndex((c) => c.contains(e.target)); if (i < 0) return;
    scrollTo({ top: Math.round(st.start + (i / (n - 1)) * (st.end - st.start)) + 1, behavior: 'instant' });
    cible = p = i; rendre();
  });
  rafraichir();
}

/* ================= SAUVEGARDE ================= */

/* Le fichier part de l'ordinateur, se chiffre, se met à l'abri dans deux centres, puis reste accessible partout. */
export function trajet() {
  const scene = $('.trajet-scene'); if (!scene) return;
  const stations = $$('.station', scene), fichier = $('.trajet-fichier', scene), piste = $('.trajet', scene);
  const n = stations.length;
  const poser = (p) => {
    const i = Math.min(n - 1, Math.floor(p * n * .999));
    stations.forEach((s, j) => s.classList.toggle('est-atteinte', j <= i));
    const w = piste.clientWidth - fichier.offsetWidth;
    fichier.style.setProperty('--tx', `${(borne(p, 0, 1) * w).toFixed(1)}px`);
    fichier.style.setProperty('--tr', `${(Math.sin(p * Math.PI * 6) * 6).toFixed(2)}deg`);
    fichier.classList.toggle('chiffre', p >= 1 / n);
  };
  if (etat.calme || !ST || !gsap) { stations.forEach((s) => s.classList.add('est-atteinte')); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const st = ST.create({ trigger: scene, start: 'top top', end: '+=160%', pin: $('.ecran-interieur', scene), onUpdate: (s) => poser(s.progress), onRefresh: (s) => poser(s.progress), onToggle: (s) => scene.classList.toggle('est-epingle', s.isActive) });
    return () => st.kill();
  });
  mm.add('(max-width: 760px)', () => {
    const sts = stations.map((s) => ST.create({ trigger: s, start: 'top 72%', onEnter: () => s.classList.add('est-atteinte'), onLeaveBack: () => s.classList.remove('est-atteinte') }));
    return () => sts.forEach((s) => s.kill());
  });
}

/* Testez une panne : le fichier disparaît de l'ordinateur, puis revient depuis la sauvegarde. */
export function panne() {
  const zone = $('[data-panne]'); if (!zone) return;
  const boutons = $$('[data-cause]', zone), etatTxt = $('[data-panne-etat]', zone);
  let minuteur = 0;
  /* À l'arrivée dans l'écran, le fichier se pose sur l'ordinateur (puis le test se fait au clic). */
  const f = $('.panne-fichier .fichier', zone);
  if (f && !etat.calme && gsap && ST) { gsap.set(f, { y: -26, opacity: 0 }); ST.create({ trigger: zone, start: 'top 80%', once: true, onEnter: () => gsap.to(f, { y: 0, opacity: 1, duration: .6, ease: 'back.out(2)', clearProps: 'transform,opacity' }) }); }
  boutons.forEach((b) => b.addEventListener('click', () => {
    clearTimeout(minuteur);
    boutons.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    const perdu = (zone.dataset.perdu || '{c}').replace('{c}', b.dataset.cause), ok = zone.dataset.restaure || '';
    zone.classList.remove('restaure');
    if (etat.calme) { etatTxt.textContent = `${perdu} ${ok}`; zone.classList.add('restaure'); return; }
    zone.classList.add('perdu');
    etatTxt.textContent = perdu;
    minuteur = setTimeout(() => { zone.classList.remove('perdu'); zone.classList.add('restaure'); etatTxt.textContent = `${perdu} ${ok}`; }, 1100);
  }));
}

/* ================= FORMATIONS ================= */

/* Molette de mode crantée : on la tourne (souris, doigt, flèches) ; chaque cran ouvre un bloc du programme. */
export function molette() {
  const m = $('.molette'); if (!m) return;
  const tourne = $('.molette-tourne', m), blocs = $$('.mode-bloc'), n = blocs.length;
  const lettres = blocs.map((b) => $('.mode-lettre', b)?.textContent.trim() || '');
  const gabarit = (m.getAttribute('aria-valuetext') || '').replace(/[A-D]$/, '');
  /* angle : position de la molette ; cible : cran visé (les flèches s'enchaînent sans attendre la fin du mouvement) ;
     invite : petit tour d'invite ajouté par-dessus, sans toucher au cran. */
  let angle = 0, cible = 0, index = 0, tw = null, touchee = false;
  const invite = { v: 0 };
  const rendre = () => { const a = (angle + invite.v).toFixed(2) + 'deg'; tourne.style.setProperty('--angle', a); m.style.setProperty('--angle', a); };
  const poserAngle = (a) => { angle = a; rendre(); };
  const indexDe = (a) => ((Math.round(-a / 90) % n) + n) % n;
  const montrer = (i) => {
    if (i === index && blocs[i].classList.contains('est-actif')) return;
    index = i;
    blocs.forEach((b, j) => b.classList.toggle('est-actif', j === i));
    m.setAttribute('aria-valuenow', String(i + 1));
    m.setAttribute('aria-valuetext', gabarit + lettres[i]);
    if (gsap && !etat.calme) gsap.fromTo(blocs[i], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power3.out', clearProps: 'transform,opacity' });
    rafraichir();
  };
  const caler = (a, anime = true) => {
    cible = Math.round(a / 90) * 90;
    if (tw) tw.kill();
    montrer(indexDe(cible));
    if (!anime || etat.calme || !gsap) { poserAngle(cible); return; }
    const o = { a: angle };
    tw = gsap.to(o, { a: cible, duration: .45, ease: 'back.out(2.2)', onUpdate: () => poserAngle(o.a) });
  };
  /* Au doigt et à la souris : on suit l'angle du pointeur autour du centre. */
  let saisie = null;
  const angleDe = (e) => { const r = m.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  m.addEventListener('pointerdown', (e) => {
    if (e.button && e.button !== 0) return;
    touchee = true;
    if (tw) tw.kill();
    saisie = { a0: angleDe(e), depart: angle, bouge: 0, id: e.pointerId };
    m.setPointerCapture?.(e.pointerId);
  });
  m.addEventListener('pointermove', (e) => {
    if (!saisie || e.pointerId !== saisie.id) return;
    let d = angleDe(e) - saisie.a0; if (d > 180) d -= 360; if (d < -180) d += 360;
    saisie.bouge = Math.max(saisie.bouge, Math.abs(d));
    poserAngle(saisie.depart + d);
    const i = indexDe(angle); if (i !== index) montrer(i);
  });
  m.addEventListener('pointerup', (e) => {
    if (!saisie || e.pointerId !== saisie.id) return;
    const clic = saisie.bouge < 4; saisie = null;
    caler(clic ? cible - 90 : angle);
  });
  m.addEventListener('pointercancel', () => { if (saisie) { saisie = null; caler(angle); } });
  m.addEventListener('keydown', (e) => {
    const k = { ArrowRight: -90, ArrowUp: -90, ArrowLeft: 90, ArrowDown: 90 }[e.key];
    touchee = true;
    if (k != null) { e.preventDefault(); if ((k < 0 && index === n - 1) || (k > 0 && index === 0)) return; caler(cible + k); }
    else if (e.key === 'Home') { e.preventDefault(); caler(cible + index * 90); }
    else if (e.key === 'End') { e.preventDefault(); caler(cible - (n - 1 - index) * 90); }
  });
  /* Arrivée depuis un lien #bloc-b, #bloc-c… : la molette est déjà sur le bon cran. */
  const depuisAncre = (anime) => {
    const h = (location.hash.match(/^#bloc-([a-d])$/) || [])[1];
    const i = h ? lettres.map((l) => l.toLowerCase()).indexOf(h) : -1;
    if (i >= 0) caler(-i * 90, anime);
    return i;
  };
  index = -1;
  if (depuisAncre(false) < 0) caler(0, false);
  addEventListener('hashchange', () => depuisAncre(true));
  /* Quand la molette arrive à l'écran : un quart de cran d'invite, puis retour (sans changer de bloc). */
  if (!etat.calme && ST && gsap) ST.create({ trigger: m, start: 'top 70%', once: true, onEnter: () => { if (touchee) return; gsap.timeline({ onUpdate: rendre }).to(invite, { v: -24, duration: .35, ease: 'power2.out' }).to(invite, { v: 0, duration: .5, ease: 'back.out(2.5)' }); } });
}

/* Petits mouvements liés au défilement des quatre pages. */
export function mouvementsV2() {
  const op = $('.op-poste');
  if (op) scrubVar($('.cachet'), '--rot', -12, 18, 'deg', { trigger: op, start: 'top top', end: 'bottom top', calme: 0 });
  const fin = $('.appel-enveloppes');
  if (fin) $$('.env', fin).forEach((e, i) => { scrubVar(e, '--vy', 30 + i * 16, -24 - i * 10, 'px', { trigger: fin, start: 'top 95%', end: 'bottom 20%', calme: .5 }); scrubVar(e, '--vr', -8 + i * 6, 6 - i * 5, 'deg', { trigger: fin, start: 'top 95%', end: 'bottom 20%', calme: .5 }); });
  const objets = $('.op-objets');
  if (objets) scrubVar($('.op-objets-media'), '--rot', 0, -4, 'deg', { trigger: objets, start: 'top top', end: 'bottom top', calme: 0 });
  const viseur = $('.op-viseur');
  if (viseur) scrubVar($('.viseur-af'), '--af', 1, .82, '', { trigger: viseur, start: 'top top', end: 'bottom top', calme: 1 });
  const tir = $('.appel-tirages');
  if (tir) $$('.tirage-vide', tir).forEach((t, i) => scrubVar(t, '--ty', 40 + i * 20, -10 - i * 8, 'px', { trigger: tir, start: 'top 95%', end: 'bottom 20%', calme: 1 }));
}

/* Ouvertures des quatre pages (dans la timeline d'intro ou d'arrivée). */
export function ouvrirV2(tl, t0, page) {
  if (!gsap) return;
  if (page === 'publipostage' && $('.cachet')) tl.fromTo('.cachet', { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: .38, ease: 'power4.in', clearProps: 'transform' }, t0 + .3).fromTo('.cachet', { y: 0 }, { y: 5, duration: .07, yoyo: true, repeat: 1, immediateRender: false, clearProps: 'transform' }, t0 + .7);
  if (page === 'objets-publicitaires' && $('.op-objets-media')) tl.fromTo('.op-objets-media', { y: 60, rotation: 7, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .8, ease: 'back.out(1.3)', clearProps: 'transform' }, t0 + .1);
  if (page === 'sauvegarde' && $('.sauve-rempli')) {
    tl.fromTo('.sauve-cadenas', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' }, t0)
      .fromTo('.sauve-cadenas path', { y: -7 }, { y: 0, duration: .3, ease: 'power4.in' }, t0 + .45)
      .fromTo('.sauve-rempli', { '--rempli': 0 }, { '--rempli': 1, duration: 1.4, ease: 'steps(8)' }, t0 + .3);
  }
  if (page === 'formations' && $('.viseur-af')) {
    const op = $('.op-viseur'); op.classList.remove('net');
    tl.fromTo('.op-viseur-fond img', { filter: 'blur(9px)' }, { filter: 'blur(0px)', duration: .9, ease: 'power2.out', clearProps: 'filter' }, t0)
      .fromTo('.viseur-af', { '--af': 1.5 }, { '--af': 1, duration: .9, ease: 'power3.out' }, t0)
      .fromTo('.viseur-centre', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .6 }, t0 + .2)
      .add(() => op.classList.add('net'), t0 + .9);
  }
}

export function etatFinalV2() {
  if (!gsap) return;
  gsap.set('.cachet, .op-objets-media, .sauve-cadenas, .viseur-centre', { opacity: 1, clearProps: 'transform' });
  gsap.set('.sauve-cadenas path', { clearProps: 'transform' });
  const r = $('.sauve-rempli'); if (r) r.style.setProperty('--rempli', '1');
  const op = $('.op-viseur'); if (op) op.classList.add('net');
}
