/* Print & Web : fond papier clair, très grand titre centré, dépliant fermé qui s'ouvre à l'arrivée et au défilement ;
   scène épinglée du dépliant trois volets (10 supports imprimés) ; la mise en page passe à l'écran (6 services web) ;
   réalisations suspendues au séchoir ; appel au devis prérempli. */
import { html } from '../../outils/gabarit.mjs';
import { repere, coins, barreControle } from '../gabarits/commun.mjs';

/* Miniature d'un volet intérieur (formes seulement, aucun texte) pour le dépliant fermé du héros. */
const mini = (encre, lignes, image) => html`<span class="mini enc-${encre}"><i class="mini-num"></i><i class="mini-titre"></i>${Array.from({ length: lignes }, () => html`<i class="mini-ligne"></i>`)}<i class="mini-image mini-image--${image}"></i></span>`;

export const page = { cle: 'print-web', fichier: 'print-web', imagePartage: 'grok/service-print-1040.webp' };

const IMAGES_VOLETS = [
  { nom: 'grok/service-print', alt: 'Papeterie vierge : cartes de visite, papier à en-tête et enveloppes' },
  { nom: 'grok/ouverture-accueil', alt: 'Nuanciers en éventail et pots d\'encre cyan, magenta et jaune' },
  { nom: 'grok/publicite-livret', alt: 'Livret ouvert aux pages vierges, près d\'une fenêtre' },
];

export default (c) => {
  const p = c.donnees.print, r = c.donnees.realisations;
  return html`
<section class="ouverture-page op-print" id="debut" data-section data-fil-point="0.04 0.92">
  ${c.media({ nom: 'grok/fond-papier', alt: '', priorite: true, classe: 'op-print-fond', sizes: '100vw', cadrage: '75% 50%', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  <div class="op-print-texte">
    <p class="surtitre enc-c" data-anime="gsap">${c.t('printweb.surtitre')}</p>
    <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('printweb.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('printweb.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('printweb.texte')}</p>
    <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=print', classe: 'bouton', texte: c.t('printweb.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <span class="hero-info" data-info-cle>${c.t('printweb.info')}</span></p>
  </div>
  <div class="depliant-ferme" data-iris-centre data-effet="depliant-couverture" role="img" aria-label="${c.s('printweb.couverture')}">
    <span class="volet-f volet-f--dessous" aria-hidden="true">${mini('m', 3, 'nuancier')}</span>
    <span class="volet-f volet-f--couverture" aria-hidden="true">
      <span class="face face--avant">${repere()}<span class="couverture-titre">Print · Web</span><span class="couverture-bande"></span></span>
      <span class="face face--arriere">${mini('c', 4, 'papier')}</span>
    </span>
  </div>
</section>

<section class="section depliant-scene section--papier2" id="imprimes" data-fil="gauche" data-grille="scene" data-entete-cache data-plein-ecran>
  <div class="ecran-interieur">
    <div class="depliant-tete conteneur">
      <div><p class="surtitre enc-m" data-fil-repere>${c.t('printweb.surtitre')}</p><h2 class="titre-section" data-anime="lignes">${c.t('printweb.depliantTitre')}</h2></div>
      <p class="intro">${c.t('printweb.depliantIntro')}</p>
    </div>
    <div class="depliant" data-tient data-visuel>
      ${p.volets.map((v, i) => html`<article class="volet enc-${v.encre}" data-effet="depliant">${i === 2 ? html`<span class="verso" aria-hidden="true">${repere()}<span>Print · Web</span></span>` : ''}${i === 0 ? html`<span class="verso verso--contact" aria-hidden="true">${barreControle('barre-controle--verso')}<span class="verso-nom">Nolanis</span><span class="verso-ligne">Strasbourg</span><span class="verso-ligne">${c.site.contact.telephone}</span></span>` : ''}
        <p class="volet-num">${c.t('printweb.volet')} ${i + 1} / 3</p>
        <h3>${v.titre}</h3>
        <ul>${v.liste.map((l) => html`<li>${l}</li>`)}</ul>
        ${c.media({ nom: IMAGES_VOLETS[i].nom, alt: IMAGES_VOLETS[i].alt, sizes: '(max-width: 760px) 100vw, 30vw', cadrage: '50% 50%' })}
      </article>`)}
    </div>
  </div>
</section>

<section class="section conteneur web" id="web" data-fil="gauche">
  <div>
    <p class="surtitre enc-j" data-fil-repere>${c.t('printweb.webSurtitre')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('printweb.webTitre')}</h2>
    <p class="intro" data-anime>${c.t('printweb.webIntro')}</p>
    ${c.media({ nom: 'grok/service-web', alt: c.s('printweb.webAlt'), classe: 'web-media', sizes: '(max-width: 900px) 100vw, 40vw', attrs: 'data-fx="onde"' })}
  </div>
  <div class="navigateur" data-visuel>
    <div class="navigateur-barre" aria-hidden="true"><i></i><i></i><i></i><span></span></div>
    <ul class="blocs" data-imposition data-effet="reimposition" role="list">${p.web.map((w, i) => html`<li class="bloc-web enc-${['c', 'm', 'j', 'n', 't', 'c'][i]}"><strong>${w.nom}</strong></li>`)}</ul>
  </div>
</section>

<section class="section section--papier2" id="sechoir" data-fil="gauche">
  <div class="conteneur">
    <p class="surtitre enc-n" data-fil-repere>${c.t('printweb.sechoirSurtitre')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('printweb.sechoirTitre')}</h2>
    <p class="intro" data-anime>${c.t('printweb.sechoirIntro')}</p>
    <div class="sechoir">
      ${[r.slice(0, 4), r.slice(4)].map((ligne) => html`<div class="sechoir-fil">${ligne.map((x) => html`<article class="tirage" id="realisation-${x.id}" data-effet="sechoir">
        ${c.media({ nom: x.image, alt: x.alt, sizes: '(max-width: 760px) 46vw, 22vw' })}
        <h3>${x.nom}</h3><p>${x.type}</p></article>`)}</div>`)}
    </div>
  </div>
</section>

<section class="section conteneur appel" id="fin" data-fil="gauche">
  <div>
    <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('printweb.finTitre')}</h2>
    <p data-anime>${c.t('printweb.finTexte')}</p>
    <p class="appel-actions">
      ${c.lien('contact', { ancre: 'devis', params: 'service=print', classe: 'bouton', texte: c.t('commun.devis'), attrs: 'data-survol="magnetique"' })}
      <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
    </p>
  </div>
  ${c.media({ nom: 'grok/contact-atelier', alt: 'Établi de façonnage : tapis de coupe, règle, plioir et compte-fils', sizes: '(max-width: 760px) 100vw, 45vw', cadrage: '50% 60%', attrs: 'data-anime="rideau"' })}
</section>
`;
};
