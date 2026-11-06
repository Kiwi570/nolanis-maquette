/* Formations : ouverture dans le viseur (collimateurs qui se resserrent pour la mise au point) ;
   molette de mode crantée à tourner (A, B, C, D) qui ouvre chaque bloc du programme ; le matériel ; appel. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'formations', fichier: 'formations', imagePartage: 'grok/ouverture-formations-1168.webp' };

export default (c) => {
  const f = c.donnees.formation;
  return html`
<section class="ouverture-page op-viseur" id="debut" data-section data-fil-point="0.03 0.94" data-gouttiere="#17161b">
  ${c.media({ nom: 'grok/ouverture-formations', alt: c.s('formations.alt'), priorite: true, classe: 'op-viseur-fond', sizes: '100vw', cadrage: '60% 50%', cadrageMobile: '50% 65%', attrs: 'data-fx="zoom" data-fx-force="8"' })}
  <div class="viseur" aria-hidden="true" data-superpose>
    <span class="viseur-coin viseur-coin--hg"></span><span class="viseur-coin viseur-coin--hd"></span><span class="viseur-coin viseur-coin--bg"></span><span class="viseur-coin viseur-coin--bd"></span>
    <div class="viseur-af" data-effet="mise-au-point">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => html`<i class="af af-${i}"></i>`)}</div>
    <div class="viseur-echelle">${Array.from({ length: 13 }, (_, i) => html`<i class="${i === 6 ? 'zero' : ''}"></i>`)}</div>
  </div>
  <div class="viseur-centre" data-iris-centre="disque" data-anime="gsap" aria-hidden="true"></div>
  <div class="op-viseur-texte">
    <p class="surtitre enc-j" data-anime="gsap">${c.t('formations.surtitre')}</p>
    <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('formations.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('formations.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('formations.texte')}</p>
    <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=formations', classe: 'bouton', texte: c.t('formations.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="hero-info" href="#programme" data-info-cle>${c.t('formations.info')}</a></p>
  </div>
</section>

<section class="section conteneur" id="programme" data-fil="gauche">
  <p class="surtitre enc-m" data-fil-repere>${c.t('formations.molSurtitre')}</p>
  <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('formations.molTitre')}</h2>
  <p class="intro" data-anime>${c.t('formations.molIntro')}</p>
  <div class="mode" data-mode>
    <div class="molette" tabindex="0" role="slider" aria-label="${c.s('formations.molette')}" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" aria-valuetext="${c.s('formations.bloc', { l: 'A' })}" data-effet="molette" data-grille="manipuler" data-visuel>
      <div class="molette-tourne"><span class="molette-crans"></span>${f.map((b, i) => html`<b class="molette-lettre" style="--a:${i * 90}deg">${b.lettre}</b>`)}</div>
      <span class="molette-repere" aria-hidden="true"></span>
    </div>
    <div class="mode-blocs">${f.map((b, i) => html`<article class="mode-bloc${i === 0 ? ' est-actif' : ''}" data-bloc="${i}" id="bloc-${b.lettre.toLowerCase()}"><p class="mode-lettre" aria-hidden="true">${b.lettre}</p><h3>${b.titre}</h3><p>${b.texte}</p></article>`)}</div>
  </div>
  <p class="a-completer">${c.t('formations.infos')}</p>
</section>

<section class="section section--papier2" id="materiel" data-fil="gauche">
  <div class="conteneur bloc-texte bloc-texte--inverse">
    ${c.media({ nom: 'grok/formations-objectifs', alt: c.s('formations.materielAlt'), sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
    <div>
      <p class="surtitre enc-c" data-fil-repere>${c.t('formations.materielSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('formations.materielTitre')}</h2>
      <p data-anime>${c.t('formations.materielTexte')}</p>
    </div>
  </div>
</section>

<section class="section conteneur appel-court" id="fin" data-fil="gauche">
  <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
  <h2 class="titre-section" data-anime="lignes">${c.t('formations.finTitre')}</h2>
  <p data-anime>${c.t('formations.finTexte')}</p>
  <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=formations', classe: 'bouton', texte: c.t('formations.action') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
  <div class="appel-tirages" data-visuel aria-hidden="true" data-effet="tirages">${[0, 1, 2].map((i) => html`<span class="tirage-vide" style="--i:${i}"></span>`)}</div>
</section>
`;
};
