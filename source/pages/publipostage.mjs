/* Publipostage : ouverture plein cadre (casiers de tri) avec cachet d'oblitération qui se tamponne ;
   scène épinglée de l'enveloppe à travers les cinq étapes ; choix du délai J+1, J+4, J+7 (l'enveloppe file
   jusqu'à la boîte, le devis se préremplit) ; l'e-mailing ; appel. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'publipostage', fichier: 'publipostage', imagePartage: 'grok/ouverture-publipostage-1168.webp' };

const enveloppe = (cls = '') => html`<svg class="env ${cls}" viewBox="0 0 160 110" aria-hidden="true" focusable="false"><rect class="env-corps" x="4" y="14" width="152" height="92" rx="3"/><g class="env-lettre"><rect x="18" y="4" width="124" height="70" rx="2"/><path d="M30 20 H110 M30 32 H124 M30 44 H96"/></g><path class="env-rabat" d="M4 17 L80 66 L156 17"/><path class="env-trait" d="M18 84 H70 M18 92 H54"/><rect class="env-timbre" x="122" y="26" width="24" height="28"/></svg>`;

export default (c) => {
  const e = c.donnees.etapes;
  return html`
<section class="ouverture-page op-poste" id="debut" data-section data-fil-point="0.03 0.94">
  ${c.media({ nom: 'grok/ouverture-publipostage', alt: c.s('publipostage.alt'), priorite: true, classe: 'op-poste-fond', sizes: '100vw', cadrage: '60% 50%', cadrageMobile: '50% 70%', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="op-poste-grille">
    <div class="op-poste-texte">
      <p class="surtitre enc-j" data-anime="gsap">${c.t('publipostage.surtitre')}</p>
      <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('publipostage.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('publipostage.titre2')}</span></span></h1>
      <p class="hero-intro" data-anime="gsap">${c.t('publipostage.texte')}</p>
      <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=publipostage', classe: 'bouton', texte: c.t('publipostage.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="hero-info" href="#delai" data-info-cle>${c.t('publipostage.info')}</a></p>
    </div>
    <div class="cachet" data-iris-centre="disque" data-effet="cachet" data-anime="gsap" data-superpose role="img" aria-label="${c.s('publipostage.cachet')}">
      <svg viewBox="-60 -60 120 120" aria-hidden="true" focusable="false"><circle r="52" class="c-cercle"/><circle r="40" class="c-cercle" stroke-width="1.2"/><path class="c-ondes" d="M58 -18 C 78 -26, 96 -10, 116 -18 S 152 -26, 170 -18 M58 0 C 78 -8, 96 8, 116 0 S 152 -8, 170 0 M58 18 C 78 10, 96 26, 116 18 S 152 10, 170 18"/><g transform="scale(.62)">${repere('', 'x="-50" y="-50" width="100" height="100"')}</g></svg>
    </div>
  </div>
</section>

<section class="section poste-scene" id="parcours" data-fil="gauche" data-grille="scene" data-entete-cache data-plein-ecran>
  <div class="ecran-interieur">
    <div class="depliant-tete conteneur">
      <div><p class="surtitre enc-m" data-fil-repere>${c.t('publipostage.etapesSurtitre')}</p><h2 class="titre-section" data-anime="lignes">${c.t('publipostage.etapesTitre')}</h2></div>
      <p class="intro">${c.t('publipostage.etapesIntro')}</p>
    </div>
    <div class="poste conteneur" data-tient>
      <ol class="poste-etapes">${e.map((x, i) => html`<li class="poste-etape" data-poste="${i}"><span class="etape-num" aria-hidden="true">${x.n}</span><div><h3>${x.nom}</h3><p>${x.texte}</p></div></li>`)}</ol>
      <div class="poste-visuel" data-visuel aria-hidden="true">
        <span class="poste-feuille" data-effet="poste"></span>
        ${enveloppe('env--scene')}
        <span class="poste-nuancier"><i class="enc-c"></i><i class="enc-m"></i><i class="enc-j"></i><i class="enc-n"></i></span>
      </div>
    </div>
  </div>
</section>

<section class="section conteneur" id="delai" data-fil="gauche">
  <p class="surtitre enc-c" data-fil-repere>${c.t('publipostage.delaiSurtitre')}</p>
  <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('publipostage.delaiTitre')}</h2>
  <p class="intro" data-anime>${c.t('publipostage.delaiIntro')}</p>
  <div class="delai" data-delai data-choisi="${c.s('publipostage.delaiChoisi', { d: '{d}' })}">
    <div class="delai-choix" role="group" aria-label="${c.s('publipostage.delaiSurtitre')}">${['J+1', 'J+4', 'J+7'].map((d, i) => html`<button type="button" class="filtre" data-jour="${d}" aria-pressed="${i === 1 ? 'true' : 'false'}">${d}</button>`)}</div>
    <div class="delai-route" data-visuel>
      <svg class="delai-trace" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path d="M10 90 C 120 20, 220 110, 330 60 S 520 30, 560 70" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 8" vector-effect="non-scaling-stroke"/></svg>
      <span class="delai-env" data-effet="delai">${enveloppe()}</span>
      <span class="delai-boite" role="img" aria-label="${c.s('publipostage.boite')}"><svg viewBox="0 0 60 70" aria-hidden="true"><rect x="6" y="18" width="48" height="46" rx="4"/><path d="M14 30 H46"/><rect x="24" y="52" width="12" height="18"/></svg></span>
    </div>
    <p class="delai-etat mono" data-delai-etat aria-live="polite">${c.t('publipostage.delaiChoisi', { d: 'J+4' })}</p>
    <p>${c.lien('contact', { ancre: 'devis', params: 'service=publipostage&support=Envoi%20en%20J%2B4', classe: 'bouton', texte: c.t('publipostage.delaiAction'), attrs: 'data-delai-lien data-grille="retour"' })}</p>
  </div>
</section>

<section class="section section--papier2" id="e-mailing" data-fil="gauche">
  <div class="conteneur bloc-texte">
    <div>
      <p class="surtitre enc-n" data-fil-repere>${c.t('publipostage.mailSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('publipostage.mailTitre')}</h2>
      <p data-anime>${c.t('publipostage.mailTexte')}</p>
      <div class="boite-mail" data-visuel aria-hidden="true"><span class="bm-barre"><i></i><i></i><i></i></span><ul class="bm-liste" data-imposition data-effet="reimposition">${[0, 1, 2, 3].map((i) => html`<li class="bm-ligne${i === 0 ? ' bm-ligne--nouveau' : ''}"><b></b><span></span></li>`)}</ul></div>
    </div>
    ${c.media({ nom: 'grok/publipostage-mise-sous-pli', alt: c.s('publipostage.mailAlt'), sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="section conteneur appel-court" id="fin" data-fil="gauche">
  <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
  <h2 class="titre-section" data-anime="lignes">${c.t('publipostage.finTitre')}</h2>
  <p data-anime>${c.t('publipostage.finTexte')}</p>
  <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=publipostage', classe: 'bouton', texte: c.t('commun.devis'), attrs: 'data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  <div class="appel-enveloppes" data-visuel aria-hidden="true" data-effet="envol-enveloppes">${[0, 1, 2].map(() => enveloppe())}</div>
</section>
`;
};
