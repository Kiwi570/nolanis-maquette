/* Sauvegarde : ouverture nocturne compacte, prix en très grand et barre de sauvegarde incrémentale ;
   scène épinglée du trajet d'un fichier (ordinateur, chiffrement, deux centres de données, partout) ;
   « Testez une panne » : le fichier disparaît puis revient depuis la sauvegarde ; appel. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'sauvegarde', fichier: 'sauvegarde', imagePartage: 'grok/ouverture-sauvegarde-1168.webp' };

const fichier = () => html`<svg class="fichier" viewBox="0 0 60 76" aria-hidden="true"><path class="f-corps" d="M4 4 H40 L56 20 V72 H4 Z"/><path class="f-coin" d="M40 4 V20 H56"/><path class="f-lignes" d="M14 34 H46 M14 44 H46 M14 54 H36"/></svg>`;

export default (c) => html`
<section class="ouverture-page op-sauve" id="debut" data-section data-fil-point="0.03 0.94" data-gouttiere="#17161b">
  ${c.media({ nom: 'grok/ouverture-sauvegarde', alt: c.s('sauvegarde.alt'), priorite: true, classe: 'op-sauve-fond', sizes: '100vw', cadrage: '60% 50%', cadrageMobile: '50% 70%' })}
  <div class="op-sauve-texte">
    <div class="sauve-cadenas" data-iris-centre="disque" data-anime="gsap" data-effet="cadenas" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28"/><path d="M21 28 V22 a9 9 0 0 1 18 0 V28"/><rect x="17" y="28" width="26" height="18" rx="3"/></svg></div>
    <p class="surtitre enc-m" data-anime="gsap">${c.t('sauvegarde.surtitre')}</p>
    <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('sauvegarde.titre')}</span></span></h1>
    <p class="sauve-prix" data-prix data-info-cle data-anime="gsap">${c.t('sauvegarde.prix')}</p>
    <p class="hero-intro" data-anime="gsap">${c.t('sauvegarde.question')}</p>
    <div class="sauve-barre" data-anime="gsap" aria-hidden="true"><span class="sauve-barre-txt mono">${c.t('sauvegarde.barre')}</span><span class="sauve-piste"><span class="sauve-rempli" data-effet="barre-sauvegarde"></span>${[1, 2, 3, 4, 5, 6, 7].map((i) => html`<i style="left:${i * 12.5}%"></i>`)}</span></div>
    <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=sauvegarde', classe: 'bouton', texte: c.t('sauvegarde.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <span class="a-completer">${c.t('sauvegarde.tarifs')}</span></p>
  </div>
</section>

<section class="section trajet-scene section--papier2" id="trajet" data-fil="gauche" data-grille="scene" data-entete-cache data-plein-ecran>
  <div class="ecran-interieur">
    <div class="depliant-tete conteneur">
      <div><p class="surtitre enc-c" data-fil-repere>${c.t('sauvegarde.trajetSurtitre')}</p><h2 class="titre-section" data-anime="lignes">${c.t('sauvegarde.trajetTitre')}</h2></div>
      <p class="intro">${c.t('sauvegarde.trajetIntro')}</p>
    </div>
    <div class="trajet conteneur" data-tient data-visuel>
      <svg class="trajet-ligne" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M60 20 H940" stroke="currentColor" stroke-width="2" stroke-dasharray="8 8" fill="none" vector-effect="non-scaling-stroke"/></svg>
      <span class="trajet-fichier" data-effet="trajet" aria-hidden="true">${fichier()}</span>
      <ol class="trajet-stations">${[1, 2, 3, 4].map((i) => html`<li class="station" data-station="${i - 1}"><span class="station-pastille" aria-hidden="true">${i}</span><h3>${c.t('sauvegarde.s' + i)}</h3><p>${c.t('sauvegarde.s' + i + 't')}</p></li>`)}</ol>
    </div>
  </div>
</section>

<section class="section conteneur" id="panne" data-fil="gauche">
  <p class="surtitre enc-j" data-fil-repere>${c.t('sauvegarde.testSurtitre')}</p>
  <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('sauvegarde.testTitre')}</h2>
  <p class="intro" data-anime>${c.t('sauvegarde.testIntro')}</p>
  <div class="panne" data-panne data-perdu="${c.s('sauvegarde.perdu', { c: '{c}' })}" data-restaure="${c.s('sauvegarde.restaure')}">
    <div class="panne-choix" role="group" aria-label="${c.s('sauvegarde.testTitre')}">${[1, 2, 3, 4, 5, 6].map((i) => html`<button type="button" class="filtre" aria-pressed="false" data-cause="${c.s('sauvegarde.c' + i)}">${c.t('sauvegarde.c' + i)}</button>`)}</div>
    <div class="panne-scene" data-visuel aria-hidden="true">
      <div class="panne-poste"><span class="panne-ecran"><span class="panne-fichier" data-effet="panne">${fichier()}</span></span><span class="panne-pied"></span></div>
      <svg class="panne-fleche" viewBox="0 0 200 60"><path d="M190 30 C 140 -10, 60 -10, 10 30" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6"/><path d="M10 30 l10 -10 M10 30 l14 2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      <div class="panne-nuage"><svg viewBox="0 0 120 80"><path d="M30 66 H94 a22 22 0 0 0 -4 -44 a28 28 0 0 0 -52 6 a18 18 0 0 0 -8 38 Z"/></svg><span class="mono">×2 · France</span></div>
    </div>
    <p class="panne-etat mono" data-panne-etat role="status" aria-live="polite"></p>
  </div>
</section>

<section class="section section--papier2" id="fin" data-fil="gauche">
  <div class="conteneur appel">
    <div>
      <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('sauvegarde.finTitre')}</h2>
      <p data-anime>${c.t('sauvegarde.finTexte')}</p>
      <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=sauvegarde', classe: 'bouton', texte: c.t('commun.devis') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
    </div>
    ${c.media({ nom: 'grok/service-sauvegarde', alt: 'Disque de sauvegarde et ordinateur fermé sous une lampe de bureau', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>
`;
