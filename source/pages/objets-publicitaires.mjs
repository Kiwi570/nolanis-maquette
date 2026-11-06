/* Objets publicitaires : ouverture scindée sur le vert-jaune du logo, objets qui se posent ;
   « votre nom imprimé dessus » en direct (texte, objet), ajout à la demande avec envol vers le bouton Devis ;
   présentoir à feuilleter des six familles d'objets (module bac-a-feuilleter) ; appel. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'objets-publicitaires', fichier: 'objets-publicitaires', imagePartage: 'grok/ouverture-objets-1168.webp' };

/* Objets dessinés en code (illustratifs), avec une zone d'impression [data-impression]. */
export const dessinObjet = (cle) => ({
  calendriers: html`<svg viewBox="0 0 200 200" aria-hidden="true"><rect class="o-papier" x="30" y="40" width="140" height="130" rx="4"/><rect class="o-encre" x="30" y="40" width="140" height="34" rx="4"/><circle class="o-anneau" cx="70" cy="40" r="7"/><circle class="o-anneau" cx="130" cy="40" r="7"/><g class="o-grille">${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((k) => html`<rect x="${44 + k * 24}" y="${88 + r * 18}" width="16" height="10"/>`))}</g><text data-impression class="o-clair" x="100" y="63" text-anchor="middle">Nolanis</text></svg>`,
  'post-it': html`<svg viewBox="0 0 200 200" aria-hidden="true"><rect class="o-jaune" x="44" y="50" width="120" height="120" rx="2" transform="rotate(-6 104 110)"/><rect class="o-jaune2" x="40" y="44" width="120" height="120" rx="2"/><text data-impression x="100" y="112" text-anchor="middle">Nolanis</text></svg>`,
  trombones: html`<svg viewBox="0 0 200 200" aria-hidden="true"><path class="o-fil" d="M70 150 V60 a20 20 0 0 1 40 0 V140 a12 12 0 0 1 -24 0 V72"/><path class="o-fil o-fil--m" d="M120 160 V70 a20 20 0 0 1 40 0 V150 a12 12 0 0 1 -24 0 V82"/><rect class="o-etiquette" x="24" y="164" width="152" height="26" rx="13"/><text data-impression x="100" y="182" text-anchor="middle">Nolanis</text></svg>`,
  'blocs-notes': html`<svg viewBox="0 0 200 200" aria-hidden="true"><rect class="o-papier" x="46" y="30" width="108" height="150" rx="3"/><path class="o-spirale" d="M58 30 v-8 M74 30 v-8 M90 30 v-8 M106 30 v-8 M122 30 v-8 M138 30 v-8"/><path class="o-lignes" d="M60 80 H140 M60 98 H140 M60 116 H140 M60 134 H140 M60 152 H140"/><text data-impression x="100" y="60" text-anchor="middle">Nolanis</text></svg>`,
  'cles-usb': html`<svg viewBox="0 0 200 200" aria-hidden="true"><rect class="o-metal" x="132" y="86" width="40" height="28" rx="3"/><rect class="o-encre" x="28" y="76" width="110" height="48" rx="10"/><circle class="o-trou" cx="44" cy="100" r="6"/><text data-impression class="o-clair" x="90" y="106" text-anchor="middle">Nolanis</text></svg>`,
  magnets: html`<svg viewBox="0 0 200 200" aria-hidden="true"><circle class="o-ton" cx="100" cy="100" r="66"/><circle class="o-ombre" cx="100" cy="100" r="54"/><text data-impression x="100" y="106" text-anchor="middle">Nolanis</text></svg>`,
})[cle];

export default (c) => {
  const o = c.donnees.objets;
  return html`
<section class="ouverture-page op-objets" id="debut" data-section data-fil-point="0.03 0.94" data-gouttiere="#c6c655">
  <div class="op-objets-grille">
    <div>
      <p class="surtitre enc-n" data-anime="gsap">${c.t('objets.surtitre')}</p>
      <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('objets.titre1')}</span></span> <span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('objets.titre2')}</span></span></h1>
      <p class="hero-intro" data-anime="gsap">${c.t('objets.texte')}</p>
      <p class="hero-actions" data-anime="gsap">${c.lien('contact', { ancre: 'devis', params: 'service=objets', classe: 'bouton', texte: c.t('objets.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="hero-info" href="#presentoir" data-info-cle>${c.t('objets.info')}</a></p>
    </div>
    ${c.media({ nom: 'grok/ouverture-objets', alt: c.s('objets.alt'), priorite: true, classe: 'op-objets-media', sizes: '(max-width: 760px) 100vw, 50vw', cadrage: '60% 50%', attrs: 'data-iris-centre data-effet="pose" data-anime="gsap"' })}
  </div>
</section>

<section class="section conteneur" id="essai" data-fil="gauche">
  <p class="surtitre enc-m" data-fil-repere>${c.t('objets.essaiSurtitre')}</p>
  <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('objets.essaiTitre')}</h2>
  <p class="intro" data-anime>${c.t('objets.essaiIntro')}</p>
  <div class="essai" data-essai data-ajoute="${c.s('objets.ajoute', { o: '{o}', t: '{t}' })}" data-defaut="${c.s('objets.champDefaut')}">
    <form class="essai-form" action="#" onsubmit="return false">
      <div class="champ"><label for="f-perso">${c.t('objets.champ')}</label><input id="f-perso" name="perso" maxlength="18" value="${c.s('objets.champDefaut')}" autocomplete="off"></div>
      <fieldset class="essai-objets"><legend>${c.t('objets.support')}</legend>${o.map((x, i) => html`<label class="choix enc-${['c', 'j', 'm', 'n', 'n', 't'][i]}"><input type="radio" name="objet" value="${x.cle}" data-nom="${x.nom}"${i === 0 ? ' checked' : ''}>${x.nom}</label>`)}</fieldset>
      <p><button type="button" class="bouton" data-ajouter data-grille="retour">${c.t('objets.ajouter')}</button></p>
      <p class="essai-etat" data-essai-etat role="status" aria-live="polite"></p>
    </form>
    <div class="essai-apercu" data-visuel data-effet="impression" role="img" aria-label="${c.s('objets.apercu')}">
      ${o.map((x, i) => html`<div class="essai-objet${i === 0 ? ' est-choisi' : ''}" data-objet="${x.cle}">${dessinObjet(x.cle)}</div>`)}
      <span class="essai-fictif mono">${c.t('objets.fictif')}</span>
    </div>
  </div>
</section>

<section class="baf section--papier2" id="presentoir" data-grille="scene" data-epingle data-entete-cache aria-labelledby="titre-presentoir">
  <div class="baf__grille conteneur">
    <div class="baf__tete">
      <p class="surtitre enc-c">${c.t('objets.bacSurtitre')}</p>
      <h2 class="titre-section" id="titre-presentoir">${c.t('objets.bacTitre')}</h2>
      <p class="intro">${c.t('objets.bacIntro')}</p>
      <p class="baf__compteur" aria-hidden="true"><b data-baf-num>01</b><span> / 0${o.length}</span></p>
      <div class="baf__progres" aria-hidden="true"><span></span></div>
    </div>
    <div class="baf__caisse" data-tient data-effet="presentoir">
      <div class="baf__pile" tabindex="0" role="region" aria-label="${c.s('objets.bacTitre')}">
        ${o.map((x, i) => html`<article class="baf__pochette" data-teinte="${x.teinte}">
          <div class="baf__cadre"><div class="baf__visuel baf__visuel--dessin" data-visuel>${dessinObjet(x.cle)}</div></div>
          <div class="baf__etiquette"><h3>${c.lien('contact', { ancre: 'devis', params: `service=objets&support=${encodeURIComponent(x.nom)}`, texte: html`<span class="baf__num">0${i + 1}</span>${x.nom}` })}</h3><p>${x.texte}</p></div>
        </article>`)}
      </div>
      <div class="baf__bois" aria-hidden="true"></div>
    </div>
  </div>
</section>

<section class="section conteneur appel" id="fin" data-fil="gauche">
  <div>
    <p class="surtitre enc-t" data-fil-repere>${c.t('commun.devis')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('objets.finTitre')}</h2>
    <p data-anime>${c.t('objets.finTexte')}</p>
    <p class="appel-actions">${c.lien('contact', { ancre: 'devis', params: 'service=objets', classe: 'bouton', texte: c.t('commun.devis') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
  </div>
  ${c.media({ nom: 'site/objets', alt: 'Coffret cadeau avec stylos personnalisés, réalisation présentée sur le site actuel', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
</section>
`;
};
