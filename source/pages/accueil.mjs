/* Accueil « Bon à tirer » : épreuve plein cadre à caler (repère à faire tourner, photo CMJN en WebGL),
   manifeste à l'encre qui sèche, liasse des sept épreuves, réalisations imposées, publipostage en cinq étapes,
   supports publicitaires chiffrés, bande de photos, sauvegarde et formation, devis et plan d'accès. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere, coins } from '../gabarits/commun.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/ouverture-accueil-1168.webp' };

const lienService = (c, s) => s.page
  ? c.lien(s.page, { ancre: s.ancre || '', classe: 'bouton ple__lien', texte: s.lien, attrs: `aria-label="${s.lien} : ${s.nom}"` })
  : c.lien('contact', { ancre: 'devis', params: `service=${s.devis}`, classe: 'bouton ple__lien', texte: s.lien, attrs: `aria-label="${s.lien} : ${s.nom}"` });

export const planAcces = (c) => html`<div class="plan" data-visuel data-fx="trace" role="img" aria-label="${c.s('contact.carte')}">
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="rue" d="M-10 70 L410 120"/><path class="rue" d="M60 -10 L170 310"/><path class="rue" d="M300 -10 L250 310"/><path class="rue" d="M-10 230 L410 205"/>
    <path class="rue-trait" data-fx-trait d="M-10 70 L410 120 M60 -10 L170 310 M300 -10 L250 310 M-10 230 L410 205"/>
    <path class="tram" data-fx-trait d="M-10 160 C 90 150, 150 145, 205 150 S 330 165, 410 150"/>
    <path class="tram" data-fx-trait d="M205 -10 C 200 60, 205 110, 205 150 S 210 250, 215 310" opacity=".55"/>
    <circle class="place" cx="205" cy="150" r="38"/>
    <circle class="ici" cx="232" cy="128" r="7"/>
    <text x="246" y="124">Nolanis</text>
    <text x="150" y="212">Homme de Fer</text>
  </svg>
  <p class="plan-legende">${c.t('accueil.fin.station')}</p>
</div>`;

export default (c) => {
  const services = c.donnees.services;
  const photos = c.donnees.photos.photos.filter((_, i) => i % 3 === 0).slice(0, 18);
  return html`
<section class="hero" id="debut" data-section data-fil-point="0.03 0.9" data-fil-sans-perle>
  ${c.media({ nom: 'grok/ouverture-accueil', alt: c.s('accueil.hero.alt'), priorite: true, classe: 'hero-photo', sizes: '100vw', cadrage: '60% 50%', cadrageMobile: '50% 60%', attrs: 'data-calage-image' })}
  <canvas class="hero-calage" data-effet="calage" aria-hidden="true"></canvas>
  <canvas class="hero-gouttes" data-effet="gouttes" aria-hidden="true" data-audit-ignorer></canvas>
  <div class="hero-cadre" aria-hidden="true">${coins()}</div>
  <div class="hero-grille">
    <div class="hero-texte">
      <p class="surtitre enc-t" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
      <h1 class="hero-titre quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap"><em>${c.t('accueil.hero.titre2')}</em></span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre3')}</span></span></h1>
      <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
      <p class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { ancre: 'devis', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <a class="hero-info" href="tel:${c.site.contact.telephoneLien}" data-info-cle>${c.t('accueil.hero.info')}</a>
      </p>
    </div>
    <div class="hero-objet">
      <div class="oat" data-grille="manipuler" data-iris-centre="disque" data-effet="repere" data-souris role="img" aria-label="${c.s('accueil.hero.repere')}">
        <div class="oat__objet">
          <span class="oat__graduation" aria-hidden="true"></span>
          <div class="oat__tourne">${['c', 'm', 'j', 'n'].map((k) => repere(`oat__couche c-${k}`))}</div>
        </div>
        <span class="oat__reflet" aria-hidden="true"></span>
        <p class="oat__indice" aria-hidden="true">${c.t('accueil.hero.indice')}</p>
      </div>
      <p class="hero-etat" aria-hidden="true" data-etat-calage>${c.t('accueil.hero.etat')}</p>
    </div>
  </div>
</section>

<section class="section conteneur manifeste" id="manifeste" data-fil="gauche">
  <div>
    <p class="surtitre enc-m" data-fil-repere>${c.t('accueil.manifeste.surtitre')}</p>
    <span class="manifeste-grand quadri" data-effet="quadri-defilement" aria-hidden="true">20 ans</span>
    <p class="manifeste-texte" data-axes data-grille="typo" data-effet="encre">${c.t('accueil.manifeste.texte')}</p>
    <p class="manifeste-signature" data-anime>${c.t('accueil.manifeste.signature')}</p>
  </div>
  ${c.media({ nom: 'grok/fond-encre', alt: '', classe: 'manifeste-media', sizes: '(max-width: 760px) 100vw, 40vw', cadrage: '45% 50%', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
</section>

<section class="section ple section--papier2" id="services" data-fil="gauche" data-grille="scene" aria-labelledby="titre-services">
  <div class="ple__tete conteneur">
    <p class="surtitre enc-c" data-fil-repere>${c.t('accueil.services.surtitre')}</p>
    <h2 class="titre-section" id="titre-services" data-anime="lignes">${c.t('accueil.services.titre')}</h2>
    <p class="intro" data-anime>${c.t('accueil.services.intro')}</p>
  </div>
  <div class="ple__pile conteneur">
    ${services.map((s, i) => html`<article class="ple__planche enc-${s.encre}" id="service-${s.cle}" data-epingle data-tient data-effet="liasse" aria-labelledby="ple-${s.cle}">
      <div class="ple__contenu">
        <p class="ple__cartouche"><span>${c.t('commun.epreuve')} ${String(i + 1).padStart(2, '0')} / ${String(services.length).padStart(2, '0')}</span><span>${s.court}</span></p>
        <h3 class="ple__nom" id="ple-${s.cle}">${s.nom}</h3>
        <p class="ple__texte">${s.texte}</p>
        <ul class="ple__liste">${s.liste.map((l) => html`<li${/€/.test(l) ? brut(' data-prix') : ''}>${l}</li>`)}</ul>
        ${lienService(c, s)}
      </div>
      ${c.media({ nom: s.image, alt: s.alt, classe: 'ple__visuel', sizes: '(max-width: 700px) 100vw, 45vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
    </article>`)}
  </div>
</section>

<section class="section conteneur" id="realisations" data-fil="gauche">
  <p class="surtitre enc-j" data-fil-repere>${c.t('accueil.realisations.surtitre')}</p>
  <h2 class="titre-section" data-anime="lignes">${c.t('accueil.realisations.titre')}</h2>
  <p class="intro" data-anime>${c.t('accueil.realisations.intro')}</p>
  <div class="imposition" data-imposition data-effet="imposition">
    ${c.donnees.realisations.map((r) => html`<a class="feuille" href="${c.url('print-web', 'realisation-' + r.id)}" data-libelle="${c.libelle('print-web')}">${coins()}
      ${c.media({ nom: r.image, alt: r.alt, sizes: '(max-width: 900px) 46vw, 22vw' })}
      <h3>${r.nom}</h3><p>${r.type}</p></a>`)}
  </div>
  <p class="realisations-pied">${c.lien('print-web', { ancre: 'sechoir', classe: 'lien-fleche', texte: c.t('accueil.realisations.lien') })}</p>
</section>

<section class="section section--papier2" id="publipostage" data-fil="gauche">
  <div class="conteneur etapes">
    <div>
      <p class="surtitre enc-j" data-fil-repere>${c.t('accueil.etapes.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.etapes.titre')}</h2>
      <p class="intro" data-anime>${c.t('accueil.etapes.intro')}</p>
      <div class="etapes-media enveloppe-scene" data-visuel aria-hidden="true">
        <svg class="enveloppe" viewBox="0 0 160 110" data-effet="enveloppe"><rect class="env-corps" x="4" y="14" width="152" height="92" rx="3"/><path class="env-rabat" d="M4 17 L80 66 L156 17"/><path class="env-trait" d="M18 84 H70 M18 92 H54"/><rect class="env-timbre" x="122" y="26" width="24" height="28"/></svg>
        <p class="enveloppe-jour mono" data-jour>J+1 · J+4 · J+7</p>
      </div>
    </div>
    <div>
      <div class="etapes-cadre">
        <svg class="etapes-chemin" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M2 0 V100" stroke="currentColor" stroke-width="4" fill="none" vector-effect="non-scaling-stroke"/></svg>
        <ol class="etapes-liste" data-etapes>
        ${c.donnees.etapes.map((e) => html`<li class="etape" data-etape><span class="etape-num" aria-hidden="true">${e.n}</span><h3>${e.nom}</h3><p>${e.texte}</p></li>`)}
        </ol>
      </div>
      <p class="etapes-action">${c.lien('contact', { ancre: 'devis', params: 'service=publipostage', classe: 'bouton', texte: c.t('commun.devis') })}</p>
    </div>
  </div>
</section>

<section class="section conteneur chiffres-pub" id="espaces" data-fil="gauche">
  <div>
    <p class="surtitre enc-m" data-fil-repere>${c.t('accueil.chiffres.surtitre')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('accueil.chiffres.titre')}</h2>
    <ul class="chiffres-liste" data-anime="cascade">
      <li><strong class="chiffre" data-compteur="15000">15 000</strong><span class="chiffre-legende">${c.t('accueil.chiffres.c1')}</span></li>
      <li><strong class="chiffre" data-compteur="40">40</strong><span class="chiffre-legende">${c.t('accueil.chiffres.c2')}</span></li>
      <li><strong class="chiffre" data-compteur="5000">5 000</strong><span class="chiffre-legende">${c.t('accueil.chiffres.c3')}</span></li>
      <li><strong class="chiffre" data-compteur="5000">5 000</strong><span class="chiffre-legende">${c.t('accueil.chiffres.c4')}</span></li>
    </ul>
    ${c.lien('publicite', { ancre: 'chemin-de-fer', classe: 'bouton', texte: c.t('accueil.chiffres.lien') })}
  </div>
  ${c.media({ nom: 'grok/publicite-livret', alt: c.s('publicite.amicaleAlt'), classe: 'chiffres-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="onde"' })}
</section>

<section class="section section--papier2" id="photos" data-fil="gauche">
  <div class="conteneur photos-tete">
    <div>
      <p class="surtitre enc-n" data-fil-repere>${c.t('accueil.photos.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.photos.titre')}</h2>
    </div>
    ${c.lien('photo-video', { ancre: 'planche', classe: 'lien-fleche', texte: c.t('accueil.photos.lien') })}
  </div>
  <div class="ruban-photos bande-film" data-ruban>
    <div class="ruban-piste" id="ruban-photos" data-boucle-css data-effet="ruban">${[...photos, ...photos].map((p, i) => html`<img src="/assets/images/photos/p${p.n}-320.webp" alt="${i < photos.length ? p.alt : ''}" width="320" height="320" loading="lazy" decoding="async"${i >= photos.length ? brut(' aria-hidden="true"') : ''}>`)}</div>
  </div>
  <div class="photos-commandes conteneur"><button type="button" class="bouton-pause" data-pause-pour="ruban-photos" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button></div>
</section>

<section class="section section--papier2" id="contact" data-fil="gauche">
  <div class="conteneur fin">
    <div>
      <p class="surtitre enc-t" data-fil-repere>${c.t('accueil.fin.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
      <p data-anime>${c.t('accueil.fin.texte')}</p>
      <a class="fin-tel" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>
      <p>${c.site.contact.adresse}<br><span class="a-completer">${c.t('commun.horaires')}</span></p>
      <p class="fin-actions">
        ${c.lien('contact', { ancre: 'devis', classe: 'bouton', texte: c.t('commun.devis'), attrs: 'data-survol="magnetique"' })}
        ${c.lien('contact', { ancre: 'acces', classe: 'bouton bouton--contour', texte: c.t('accueil.fin.acces') })}
      </p>
    </div>
    ${planAcces(c)}
  </div>
</section>
`;
};
