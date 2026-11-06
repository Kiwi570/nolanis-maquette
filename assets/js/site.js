/* Nolanis : effets du projet. Le socle gère l'ouverture, les transitions, l'en-tête, le menu, le mode calme,
   les boucles, les mesures et la bibliothèque d'effets (data-anime, data-fx, data-survol) ; ici, seulement
   ce qui est propre à Nolanis. Intro (moins de 3 s) : traits de coupe, logo imprimé en trois passages,
   repère de calage qui glisse jusqu'à l'objet d'ouverture de la page (versObjet), puis la page s'ouvre sur lui. */
import { demarrer, etat, versObjet } from './socle/index.js?v=3';
import { initCalage, calage, quadriAuDefilement, imprimer, encre, fil, liasse, imposition, etapes, sechoir, enveloppe, titresQuadri } from './effets-nolanis.js?v=3';
import { depliant, cheminDeFer, compteFils, planche, montage, devis, mouvementsPages } from './pages-nolanis.js?v=3';
import { poste, delai, essai, presentoir, trajet, panne, molette, mouvementsV2, ouvrirV2, etatFinalV2 } from './pages-v2.js?v=3';

const gsap = window.gsap;
const $ = (s) => document.querySelector(s);
const page = (document.body.className.match(/page-([\w-]+)/) || [])[1] || 'accueil';
let calagePret = null;

/* Ce que chaque page anime à son ouverture (intro ou arrivée sous le voile). */
const OUVERTURES = {
  accueil: { lignes: '.hero-ligne', autres: '.hero .surtitre, .hero-intro, .hero-actions', titre: '.hero-titre' },
  'print-web': { lignes: '.op-print .hero-ligne', autres: '.op-print .surtitre, .op-print .hero-intro, .op-print .hero-actions', titre: '.op-print h1' },
  publicite: { lignes: '.op-pub .hero-ligne', autres: '.op-pub .surtitre, .op-pub .hero-intro, .op-pub .rouleaux, .op-pub .hero-actions', titre: '.op-pub h1' },
  'photo-video': { lignes: '.op-photo .hero-ligne', autres: '.op-photo .surtitre, .op-photo .hero-intro, .op-photo .hero-actions', titre: '.op-photo h1' },
  publipostage: { lignes: '.op-poste .hero-ligne', autres: '.op-poste .surtitre, .op-poste .hero-intro, .op-poste .hero-actions', titre: '.op-poste h1' },
  'objets-publicitaires': { lignes: '.op-objets .hero-ligne', autres: '.op-objets .surtitre, .op-objets .hero-intro, .op-objets .hero-actions', titre: '.op-objets h1' },
  sauvegarde: { lignes: '.op-sauve .hero-ligne', autres: '.op-sauve .surtitre, .op-sauve .sauve-prix, .op-sauve .hero-intro, .op-sauve .sauve-barre, .op-sauve .hero-actions', titre: '.op-sauve h1' },
  formations: { lignes: '.op-viseur .hero-ligne', autres: '.op-viseur .surtitre, .op-viseur .hero-intro, .op-viseur .hero-actions', titre: '.op-viseur h1' },
  contact: { lignes: '.op-contact .hero-ligne', autres: '.op-contact .surtitre, .op-contact .tel-geant, .op-contact address, .op-contact .hero-actions', titre: '.op-contact h1' },
  404: { lignes: '.x-aucun', autres: '.op-404 .surtitre, .op-404 p', titre: '.op-404 h1' },
};

function ouvrirPage(tl, t0) {
  const o = OUVERTURES[page]; if (!o) return;
  if (document.querySelector(o.lignes)) tl.fromTo(o.lignes, { yPercent: 135, opacity: 1 }, { yPercent: 0, opacity: 1, duration: .75, stagger: .08, ease: 'power3.out' }, t0);
  if (document.querySelector(o.autres)) tl.fromTo(o.autres, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .07, ease: 'power3.out' }, t0 + .15);
  imprimer(tl, document.querySelector(o.titre), t0 + .1, .95);
  /* Mouvement d'ouverture propre à chaque page. */
  if (page === 'print-web' && $('.volet-f--couverture')) tl.fromTo('.volet-f--couverture', { '--ouvre': '0deg' }, { '--ouvre': '-28deg', duration: .8, ease: 'power3.inOut' }, t0 + .2);
  if (page === 'publicite' && $('.couverture')) tl.fromTo('.couverture', { opacity: 0, y: 40, rotation: 12 }, { opacity: 1, y: 0, rotation: 0, duration: .8, ease: 'power3.out' }, t0 + .1);
  if (page === 'contact' && $('.tampon')) tl.fromTo('.tampon', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'power4.in' }, t0 + .25);
  ouvrirV2(tl, t0, page);
  if (page === '404' && $('.op-404 h1')) tl.fromTo('.op-404 h1', { '--rot': '180deg' }, { '--rot': '0deg', duration: .9, ease: 'back.out(1.4)' }, t0 + .1);
}

/* Le lien Menu sans JavaScript (menu ouvert par #menu) laisse la place au vrai bouton. */
document.querySelector('.menu-sansjs')?.remove();
document.querySelector('.menu-sansjs-fermer')?.remove();

demarrer({
  preparer() {
    if (page === 'accueil') { const c = initCalage(); calagePret = c && c.pret; }
    quadriAuDefilement(); encre(); liasse(); imposition(); etapes(); sechoir(); enveloppe(); titresQuadri();
    depliant(); cheminDeFer(); compteFils(); planche(); montage(); devis(); mouvementsPages();
    poste(); delai(); essai(); presentoir(); trajet(); panne(); molette(); mouvementsV2();
    if (page !== '404') fil();
  },
  pret: [new Promise((ok) => queueMicrotask(() => ok(calagePret)))],
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    /* 0 s : traits de coupe aux quatre coins ; le logo s'imprime en trois passages décalés qui se calent. */
    tl.fromTo('.ouverture-panneau .coupe', { scale: 0 }, { scale: 1, duration: .4, stagger: .04 }, 0)
      .fromTo('.passe-c', { x: -38, y: -16 }, { x: 0, y: 0, duration: .55, ease: 'power3.inOut' }, .08)
      .fromTo('.passe-m', { x: 34, y: -8 }, { x: 0, y: 0, duration: .55, ease: 'power3.inOut' }, .12)
      .fromTo('.passe-j', { x: 6, y: 22 }, { x: 0, y: 0, duration: .55, ease: 'power3.inOut' }, .16)
      .to('.ouverture-tuile', { opacity: 1, duration: .2, ease: 'none' }, .6)
      .to('.ouverture-passe', { opacity: 0, duration: .2, ease: 'none' }, .66)
      .fromTo('.ouverture-repere', { scale: .5, rotation: -120, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .45 }, .45)
      .fromTo('.ouverture-ligne', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 }, .5)
      .to('.ouverture-logo, .ouverture-ligne, .barre-controle--intro', { opacity: 0, duration: .25 }, 1.0);
    /* 1 s : le repère glisse jusqu'à l'objet d'ouverture de la page, puis la page s'ouvre en cercle depuis lui. */
    versObjet(tl, { a: .95, duree: .5, ouverture: .8 });
    /* À l'accueil, la photo arrive décalée en quatre couleurs et se cale (tl.call : hors de la durée de l'intro). */
    if (page === 'accueil') tl.call(() => { calage.intro = 1; gsap.to(calage, { intro: 0, duration: 1.3, ease: 'power2.inOut' }); }, null, 1.35);
    ouvrirPage(tl, 1.5);
    return tl;
  },
  etatFinal() {
    calage.intro = 0;
    if (!gsap) return;
    gsap.set('.hero-ligne, .hero .surtitre, .hero-intro, .hero-actions, .op-print .surtitre, .op-print .hero-intro, .op-print .hero-actions, .op-pub .surtitre, .op-pub .hero-intro, .op-pub .rouleaux, .op-pub .hero-actions, .op-photo .surtitre, .op-photo .hero-intro, .op-photo .hero-actions, .op-contact .surtitre, .op-contact .tel-geant, .op-contact address, .op-contact .hero-actions, .op-404 .surtitre, .op-404 p', { clearProps: 'transform,opacity' });
    gsap.set('.couverture, .tampon', { opacity: 1, clearProps: 'transform' });
    if (OUVERTURES[page]) gsap.set(OUVERTURES[page].autres, { clearProps: 'transform,opacity' });
    etatFinalV2();
    document.querySelectorAll('.quadri').forEach((el) => { el.style.removeProperty('--qx'); el.style.removeProperty('--qy'); });
    const couv = $('.volet-f--couverture'); if (couv && !couv.style.getPropertyValue('--ouvre')) couv.style.setProperty('--ouvre', '-28deg');
    const t404 = $('.op-404 h1'); if (t404) t404.style.setProperty('--rot', '0deg');
  },
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline({ delay: .1 });
    if (page === 'accueil') { calage.intro = .8; gsap.to(calage, { intro: 0, duration: 1.1, ease: 'power2.inOut', delay: .15 }); }
    ouvrirPage(tl, 0);
  },
});

/* Repère pour l'audit : la page tourne sur le socle sans erreur. */
window.__nolanis = { page, etat };

/* Un saut d'un écran ou plus en une seule image (lien d'ancre, retour à une section) n'est pas un geste
   de lecture : l'en-tête reste visible, le menu reste à portée. */
{
  let yPrec = scrollY;
  addEventListener('scroll', () => requestAnimationFrame(() => {
    const d = scrollY - yPrec; yPrec = scrollY;
    if (Math.abs(d) > innerHeight * .9 && !document.querySelector('.est-epingle')) document.documentElement.classList.remove('entete-cache');
  }), { passive: true });
}
