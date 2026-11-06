/* Photo & vidéo : grand titre, puis la table lumineuse où défile la bande de photos sous un compte-fils
   qu'on déplace ; planche contact filtrable entourée au crayon gras, avec visionneuse ; montage vidéo
   piloté par le défilement (illustratif) ; formation photo A à D ; appel au devis. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'photo-video', fichier: 'photo-video', imagePartage: 'site/photo-vaches-1227.webp' };

export default (c) => {
  const ph = c.donnees.photos, bande = ph.photos.filter((_, i) => i % 2 === 0).slice(0, 16);
  return html`
<section class="ouverture-page op-photo" id="debut" data-section data-fil-point="0.03 0.3">
  <div class="conteneur op-photo-texte">
    <div>
      <p class="surtitre enc-n" data-anime="gsap">${c.t('photovideo.surtitre')}</p>
      <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('photovideo.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('photovideo.titre2')}</span></span></h1>
    </div>
    <div>
      <p class="hero-intro" data-anime="gsap">${c.t('photovideo.texte')}</p>
      <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=photo', classe: 'bouton', texte: c.t('photovideo.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="hero-info" href="#planche" data-info-cle>${c.t('photovideo.info')}</a></p>
    </div>
  </div>
  <div class="table-lumineuse" data-visuel>
    ${c.media({ nom: 'grok/table-lumineuse', alt: c.s('photovideo.fond'), priorite: true, sizes: '100vw', cadrage: '55% 50%' })}
    <div class="bande" role="img" aria-label="${c.s('photovideo.planche')}"><div class="bande-piste" id="bande-photos" data-boucle-css data-effet="bande">${[...bande, ...bande].map((p) => html`<img src="/assets/images/photos/p${p.n}-320.webp" alt="" width="320" height="320" decoding="async">`)}</div></div>
    <div class="compte-fils" data-effet="compte-fils" tabindex="0" role="img" aria-label="${c.s('photovideo.loupe')}" data-iris-centre="disque">
      <div class="compte-fils-verre"><div class="compte-fils-zoom"></div><span class="compte-fils-reticule"></span></div>
      <span class="compte-fils-pied" aria-hidden="true"></span>
    </div>
    <div class="table-commandes"><p class="indice-loupe" aria-hidden="true">${c.t('photovideo.loupe')}</p><button type="button" class="bouton-pause" data-pause-pour="bande-photos" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button></div>
  </div>
</section>

<section class="section conteneur" id="planche" data-fil="gauche" aria-labelledby="titre-planche">
  <p class="surtitre enc-m" data-fil-repere>${c.t('photovideo.plancheSurtitre')}</p>
  <h2 class="titre-section" id="titre-planche" data-anime="lignes">${c.t('photovideo.plancheTitre')}</h2>
  <p class="intro" data-anime>${c.t('photovideo.plancheIntro')}</p>
  <ul class="filtres" aria-label="Sujets">
    <li><button type="button" class="filtre" data-filtre="tout" aria-pressed="true">${c.t('photovideo.tout')}</button></li>
    ${ph.categories.map((k) => html`<li><button type="button" class="filtre" data-filtre="${k.cle}" aria-pressed="false">${k.nom}</button></li>`)}
  </ul>
  <div class="planche" role="region" aria-label="${c.s('photovideo.photosRegion')}" data-visuel>
    <svg class="crayon" aria-hidden="true" data-effet="crayon-gras"><path d=""/></svg>
    ${ph.photos.map((p, i) => html`<button type="button" class="vignette" id="photo-${p.n}" data-n="${p.n}" data-cat="${p.cat}" data-alt="${p.alt}" aria-label="${c.s('photovideo.ouvrir')} : ${p.alt}"><img src="/assets/images/photos/p${p.n}-320.webp" alt="" width="320" height="320" loading="lazy" decoding="async"><span aria-hidden="true">${i + 1}A</span></button>`)}
  </div>
  <p class="planche-compte" data-compte data-modele="{n} photos" aria-live="polite">${ph.photos.length} photos</p>
</section>

<section class="section section--papier2" id="video" data-fil="gauche">
  <div class="conteneur bloc-texte">
    <div>
      <p class="surtitre enc-c" data-fil-repere>${c.t('photovideo.videoSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('photovideo.videoTitre')}</h2>
      <p data-anime>${c.t('photovideo.videoTexte')}</p>
    </div>
    <div class="montage" data-visuel>
      <div class="montage-tete"><span>${c.t('photovideo.videoFictif')}</span><span class="timecode" data-effet="timecode" aria-hidden="true">00:00:00:00</span></div>
      <div class="pistes" aria-hidden="true">
        <div class="piste-video"><span>${c.t('photovideo.videoPiste1')}</span><span class="clips"><i class="clip" style="left:2%;width:30%;background:var(--cyan)"></i><i class="clip" style="left:36%;width:22%;background:var(--cyan)"></i><i class="clip" style="left:62%;width:34%;background:var(--cyan)"></i></span></div>
        <div class="piste-video"><span>${c.t('photovideo.videoPiste2')}</span><span class="clips"><i class="clip" style="left:18%;width:26%;background:var(--magenta)"></i><i class="clip" style="left:52%;width:16%;background:var(--magenta)"></i><i class="clip" style="left:74%;width:20%;background:var(--magenta)"></i></span></div>
        <div class="piste-video"><span>${c.t('photovideo.videoPiste3')}</span><span class="clips"><i class="clip" style="left:0;width:96%;background:var(--jaune)"></i></span></div>
        <span class="tete-lecture" data-effet="timecode"></span>
      </div>
    </div>
  </div>
</section>

<section class="section conteneur" id="formation" data-fil="gauche">
  <div class="formation-tete">
    <div>
      <p class="surtitre enc-j" data-fil-repere>${c.t('photovideo.formationSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('photovideo.formationTitre')}</h2>
      <p data-anime>${c.t('photovideo.formationTexte')}</p>
      <p class="a-completer">${c.t('photovideo.formationInfos')}</p>
    </div>
    ${c.media({ nom: 'grok/service-formations', alt: 'Boîtier photo et trois objectifs posés sur une table', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="parallaxe"' })}
  </div>
  <ul class="formation-sommaire" data-anime="cascade">${c.donnees.formation.map((b) => html`<li>${c.lien('formations', { ancre: 'bloc-' + b.lettre.toLowerCase(), texte: html`<b aria-hidden="true">${b.lettre}</b><span>${b.titre}</span>` })}</li>`)}</ul>
  <p class="appel-actions">${c.lien('formations', { classe: 'bouton', texte: c.t('photovideo.formationRenvoi') })} ${c.lien('contact', { ancre: 'devis', params: 'service=formations', classe: 'bouton bouton--contour', texte: c.t('photovideo.formationAction') })}</p>
</section>

<section class="section section--papier2" id="fin" data-fil="gauche">
  <div class="conteneur appel">
    <div>
      <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('photovideo.finTitre')}</h2>
      <p data-anime>${c.t('photovideo.finTexte')}</p>
      <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=photo', classe: 'bouton', texte: c.t('commun.devis'), attrs: 'data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
    </div>
    <div class="fin-planche" data-visuel aria-hidden="true">${['04', '22', '35', '55', '61', '14'].map((n) => html`<span class="fin-vue" data-n="${n}"></span>`)}<span class="fin-loupe" data-effet="fin-loupe"></span></div>
  </div>
</section>

<div class="visionneuse" role="dialog" aria-modal="true" aria-label="${c.s('photovideo.visionneuse')}" aria-hidden="true" data-recouvrement data-gouttiere="#17161b">
  <figure><img src="/assets/images/photos/p01-600.webp" alt="" width="600" height="600"><figcaption></figcaption></figure>
  <button type="button" class="v-fermer" aria-label="${c.s('photovideo.fermer')}">✕</button>
  <button type="button" class="v-prec" aria-label="${c.s('photovideo.precedente')}">←</button>
  <button type="button" class="v-suiv" aria-label="${c.s('photovideo.suivante')}">→</button>
</div>
`;
};
