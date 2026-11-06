/* Publicité : ouverture sombre et scindée (titre, chiffres qui roulent, couverture du Strassbuch qui se redresse),
   Le Strassbuch, l'Amicale du Conseil de l'Europe, chemin de fer épinglé des six supports, appel au devis. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'publicite', fichier: 'publicite', imagePartage: 'grok/ouverture-publicite-1168.webp' };

export default (c) => html`
<section class="ouverture-page op-pub" id="debut" data-section data-fil-point="0.03 0.94" data-gouttiere="#17161b">
  ${c.media({ nom: 'grok/ouverture-publicite', alt: c.s('publicite.alt'), priorite: true, classe: 'op-pub-fond', sizes: '100vw', cadrage: '70% 55%', cadrageMobile: '50% 70%' })}
  <div class="op-pub-grille">
    <div>
      <p class="surtitre enc-t" data-anime="gsap">${c.t('publicite.surtitre')}</p>
      <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('publicite.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('publicite.titre2')}</span></span></h1>
      <p class="hero-intro" data-anime="gsap">${c.t('publicite.texte')}</p>
      <ul class="rouleaux" data-anime="gsap" data-info-cle>
        <li><strong class="chiffre" data-compteur="15000">15 000</strong><span class="chiffre-legende">${c.t('publicite.c1')}</span></li>
        <li><strong class="chiffre" data-compteur="40">40</strong><span class="chiffre-legende">${c.t('publicite.c2')}</span></li>
        <li><strong class="chiffre" data-compteur="5000">5 000</strong><span class="chiffre-legende">${c.t('publicite.c3')}</span></li>
      </ul>
      <p class="hero-actions" data-anime="gsap"><a class="bouton" href="#chemin-de-fer" data-action-principale data-survol="magnetique">${c.t('publicite.action')}</a></p>
    </div>
    <div class="couverture" data-iris-centre data-effet="couverture" data-anime="gsap">${c.media({ nom: 'site/strassbuch', alt: c.s('publicite.couvertureAlt'), sizes: '(max-width: 760px) 56vw, 30vw', priorite: true })}</div>
  </div>
</section>

<section class="section conteneur bloc-texte" id="strassbuch" data-fil="gauche">
  ${c.media({ nom: 'site/strassbuch-40', alt: c.s('publicite.strassbuchAlt'), sizes: '(max-width: 760px) 100vw, 45vw', ratio: '992 / 750', attrs: 'data-anime="rideau"' })}
  <div>
    <p class="surtitre enc-m" data-fil-repere>${c.t('publicite.strassbuchSurtitre')}</p>
    <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('publicite.strassbuchTitre')}</h2>
    <p data-anime>${c.t('publicite.strassbuchTexte')}</p>
    <ul class="liste-filet" data-anime="cascade">${c.s('publicite.strassbuchListe').split(' · ').map((l) => html`<li>${l}</li>`)}</ul>
  </div>
</section>

<section class="section section--papier2" id="amicale" data-fil="gauche">
  <div class="conteneur bloc-texte bloc-texte--inverse">
    ${c.media({ nom: 'grok/publicite-livret', alt: c.s('publicite.amicaleAlt'), sizes: '(max-width: 760px) 100vw, 40vw', ratio: '3 / 4', attrs: 'data-fx="parallaxe"' })}
    <div>
      <p class="surtitre enc-c" data-fil-repere>${c.t('publicite.amicaleSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('publicite.amicaleTitre')}</h2>
      <p data-anime>${c.t('publicite.amicaleTexte')}</p>
      <p class="mono" data-anime><span class="prix" data-prix>5 000 ex.</span> · septembre</p>
    </div>
  </div>
</section>

<section class="section chemin-scene" id="chemin-de-fer" data-fil="gauche" data-grille="scene" data-entete-cache data-plein-ecran>
  <div class="ecran-interieur">
    <div class="depliant-tete conteneur">
      <div><p class="surtitre enc-j" data-fil-repere>${c.t('publicite.cheminSurtitre')}</p><h2 class="titre-section" data-anime="lignes">${c.t('publicite.cheminTitre')}</h2></div>
      <p class="intro">${c.t('publicite.cheminIntro')}</p>
    </div>
    <ol class="chemin" data-tient data-visuel>${c.donnees.supports.map((s, i) => html`<li class="emplacement" data-effet="chemin-de-fer">
      <span class="emplacement-page">${c.t('publicite.cheminPage')} ${String(i + 1).padStart(2, '0')} · ${s.editeur}</span>
      <h3>${s.titre}</h3>
      <p>${s.texte}</p>
      <span class="emplacement-chiffre">${s.chiffre}</span>
      ${c.lien('contact', { ancre: 'devis', params: `service=publicite&support=${s.cle}`, classe: 'lien-fleche', texte: c.t('publicite.reserver'), attrs: `aria-label="${c.s('publicite.reserver')} : ${s.titre.replace(/"/g, '')}"` })}
    </li>`)}</ol>
    <p class="chemin-pied"><span>${c.t('publicite.tarifs')}</span><span>6 / 6</span></p>
  </div>
</section>

<section class="section appel-encre" id="fin" data-fil="gauche"><div class="conteneur appel">
  <div>
    <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('publicite.finTitre')}</h2>
    <p data-anime>${c.t('publicite.finTexte')}</p>
    <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=publicite', classe: 'bouton', texte: c.t('commun.devis'), attrs: 'data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
  </div>
  <div class="bon-reservation" data-visuel aria-hidden="true"><span class="bon-titre">Bon de réservation</span><span class="bon-ligne">Support</span><span class="bon-ligne">Période</span><span class="bon-ligne">Format</span><span class="bon-tampon" data-effet="bon-tampon">Réservé</span></div>
</div></section>
`;
