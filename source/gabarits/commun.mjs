/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, panneau de l'intro.
   Direction « Bon à tirer » : traits de coupe, repère de calage ⊕, barre de contrôle des encres.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir socle/README.md de la skill). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

/* Repère de calage (cercle, croix, quadrants) : réutilisé par l'intro, le voile, l'accueil, le fil. */
export const repere = (cls = '', attrs = '') => html`<svg class="repere ${cls}" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false"${brut(attrs ? ' ' + attrs : '')}><circle r="31" class="repere-anneau"/><path class="repere-quart" d="M0 0 L0 -19 A19 19 0 0 1 19 0 Z"/><path class="repere-quart" d="M0 0 L0 19 A19 19 0 0 1 -19 0 Z"/><circle r="19" class="repere-interieur"/><path class="repere-croix" d="M-48 0 H48 M0 -48 V48"/></svg>`;

/* Moitié de repère portée par chaque pan du rideau (le voile reprend le motif du calage). */
const moitie = (cote) => html`<svg class="voile-moitie voile-moitie--${cote}" viewBox="${brut(cote === 'g' ? '-50 -50 50 100' : '0 -50 50 100')}" aria-hidden="true" focusable="false"><circle r="31" class="repere-anneau"/><path class="repere-quart" d="${brut(cote === 'g' ? 'M0 0 L0 19 A19 19 0 0 1 -19 0 Z' : 'M0 0 L0 -19 A19 19 0 0 1 19 0 Z')}"/><circle r="19" class="repere-interieur"/><path class="repere-croix" d="${brut(cote === 'g' ? 'M-48 0 H0 M0 -48 V48' : 'M0 0 H48 M0 -48 V48')}"/></svg>`;

const coins = () => html`<span class="coupe coupe--hg" aria-hidden="true"></span><span class="coupe coupe--hd" aria-hidden="true"></span><span class="coupe coupe--bg" aria-hidden="true"></span><span class="coupe coupe--bd" aria-hidden="true"></span>`;
const barreControle = (cls = '') => html`<span class="barre-controle ${cls}" aria-hidden="true"><i class="enc-c"></i><i class="enc-m"></i><i class="enc-j"></i><i class="enc-n"></i><i class="enc-t"></i><i class="enc-g1"></i><i class="enc-g2"></i><i class="enc-g3"></i></span>`;

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

const logo = (c, w = 106) => html`<img class="logo-nolanis" src="/assets/images/logo-nolanis-480.webp" alt="" width="${w}" height="${Math.round(w * 400 / 1172)}">`;

/* En-tête sur deux rangées (ordinateur) : logo, signature et barre de contrôle, téléphone et devis ;
   puis la navigation en chemin de fer : chaque page est une case numérotée, la page en cours est encrée. */
function entete(c) {
  const liens = navigation(c).filter((k) => k !== 'accueil');
  const encres = ['c', 'm', 'j', 't'];
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.accueilLien')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>${logo(c)}</a>
    <p class="entete-signature">${barreControle('barre-controle--entete')}<span class="entete-signature-texte">${c.t('commun.enteteSignature')}</span></p>
    <div class="entete-actions">
      <a class="entete-tel" href="tel:${c.site.contact.telephoneLien}"><span class="entete-tel-libelle">${c.t('commun.enteteTel')}</span>${c.site.contact.telephone}</a>
      <a class="bouton" href="${c.url(c.site.actionEntete.page, c.site.actionEntete.ancre || '')}" data-libelle="${c.libelle(c.site.actionEntete.page)}"><span class="bouton-long">${c.t('commun.actionEntete')}</span><span class="bouton-court">${c.t('commun.actionCourte')}</span></a>
      <a class="menu-sansjs" href="#menu" data-menu-bouton>${c.t('commun.menu')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
  <nav class="entete-chemin" data-nav aria-label="${c.s('commun.navigation')}">
    <ul>${liens.map((k, i) => html`<li class="enc-${encres[i % encres.length]}">${c.lien(k, { texte: html`<span class="folio" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="nav-nom">${c.t(`pages.${k}.nav`)}</span>` })}</li>`)}</ul>
  </nav>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  ${coins()}
  <p class="menu-sansjs-fermer"><a href="#menu-ferme">${c.t('commun.fermer')}</a></p>
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
  <p class="menu-actions"><a class="bouton" href="${c.url('contact', 'devis')}" data-libelle="${c.libelle('contact')}">${c.t('commun.devis')}</a> <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
  ${barreControle('barre-controle--menu')}
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied" data-masque-barre>
  <div class="conteneur pied-grille">
    <div>
      <p>${logo(c, 140)}</p>
      <p>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><span class="courriel">${c.site.contact.email}</span><br>${c.t('commun.horaires')}</p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas">${barreControle('barre-controle--pied')}<p>${c.t('commun.mentions')}</p><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom}</p></div>
</footer>`;
}

function barre(c) {
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton" href="${c.url('contact', 'devis')}" data-libelle="${c.libelle('contact')}">${c.t('commun.actionCourte')}</a>
</div>`;
}

/* Voile : rideau de deux pans de papier ; chaque pan porte une moitié du repère, qui se cale au centre. */
const FORMES_VOILE = ['glisse', 'iris', 'vague', 'rideau'];
function voile(c) {
  const forme = FORMES_VOILE.includes(c.site.formeVoile) ? c.site.formeVoile : 'glisse';
  return html`<div data-voile data-forme="${forme}" aria-hidden="true">${coins()}${moitie('g')}${moitie('d')}<div class="voile-contenu"><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div>${barreControle('barre-controle--voile')}</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut" class="page-${c.page.cle}">
${voile(c)}
<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  ${coins()}
  <div class="ouverture-logo">
    <span class="ouverture-passe passe-c"></span><span class="ouverture-passe passe-m"></span><span class="ouverture-passe passe-j"></span>
    <img class="ouverture-tuile" src="/assets/images/logo-nolanis-480.webp" alt="" width="300" height="102">
  </div>
  <div class="ouverture-repere" data-ouverture-objet>${repere('repere--intro')}</div>
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
  ${barreControle('barre-controle--intro')}
</div>
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.cle !== '404' ? brut(' data-grille="fil"') : ''}${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
<template data-fil-objet><g class="fil-tete">${brut('<circle r="9" class="fil-tete-anneau"/><path d="M-13 0 H13 M0 -13 V13" class="fil-tete-croix"/>')}</g></template>
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}

export { barreControle, coins };
