/* Contact & devis : ouverture compacte violette (téléphone en très grand, tampon qui s'abat),
   devis en trois étapes avec récapitulatif en épreuve et tampon BON À TIRER (retour physique de l'action),
   accès place de l'Homme de Fer avec plan dessiné et bandeau de l'établi. */
import { html, brut } from '../../outils/gabarit.mjs';
import { coins, barreControle } from '../gabarits/commun.mjs';
import { planAcces } from './accueil.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-atelier-1168.webp' };

const tampon = (cls, mots) => html`<svg viewBox="-60 -60 120 120" aria-hidden="true" focusable="false"><circle class="t-cercle" r="54"/><circle class="t-cercle" r="44" stroke-width="1.2"/><path id="${cls}-arc" d="M-37 -6 A37 37 0 0 1 37 -6" fill="none"/><path id="${cls}-arc2" d="M-41 6 A41 41 0 0 0 41 6" fill="none"/><text class="t-petit"><textPath href="#${cls}-arc" startOffset="50%" text-anchor="middle">NOLANIS</textPath></text>${mots.length ? mots.map((m, i) => html`<text class="t-mot" x="0" y="${mots.length > 1 ? 4 + i * 20 : 12}" text-anchor="middle">${m}</text>`) : brut('<path class="t-croix" d="M-14 10 H14 M0 -4 V24"/><circle class="t-cercle" cx="0" cy="10" r="8" stroke-width="1.6"/>')}<text class="t-petit"><textPath href="#${cls}-arc2" startOffset="50%" text-anchor="middle">STRASBOURG</textPath></text></svg>`;

export default (c) => {
  const svc = c.donnees.services;
  const supports = Object.fromEntries(c.donnees.supports.map((s) => [s.cle, `${s.titre} (${s.editeur})`]));
  return html`
<section class="ouverture-page op-contact" id="debut" data-section data-gouttiere="#6b3579" data-fil-point="0.02 0.95" data-fil-sans-perle>
  <div class="op-contact-grille">
    <div>
      <p class="surtitre" data-anime="gsap">${c.t('contact.surtitre')}</p>
      <h1 class="quadri" data-grille="typo" data-effet="quadri"><span class="ligne-masque" data-superpose><span class="hero-ligne" data-anime="gsap">${c.t('contact.titre')}</span></span></h1>
      <a class="tel-geant" href="tel:${c.site.contact.telephoneLien}" data-info-cle data-anime="gsap">${c.site.contact.telephone}</a>
      <address data-anime="gsap">${c.site.contact.adresse}<br><span class="courriel">${c.site.contact.email}</span><br>${c.t('commun.horaires')}</address>
      <p class="hero-actions" data-anime="gsap"><a class="bouton" href="#devis" data-action-principale data-survol="magnetique">${c.t('contact.action')}</a></p>
    </div>
    <div class="tampon" data-iris-centre="disque" data-effet="tampon" data-visuel data-superpose data-anime="gsap">${tampon('tt', [])}</div>
  </div>
</section>

<section class="section conteneur" id="devis" data-fil="gauche" aria-labelledby="titre-devis">
  <p class="surtitre enc-m" data-fil-repere>${c.t('contact.devisSurtitre')}</p>
  <h2 class="titre-section" id="titre-devis" data-anime="lignes">${c.t('contact.devisTitre')}</h2>
  <p class="intro">${c.t('contact.devisDeroule')}</p>
  <div class="devis">
    <form data-formulaire data-devis class="formulaire" action="#" novalidate data-supports='${brut(JSON.stringify(supports).replace(/'/g, '&#39;'))}'>
      <ol class="devis-etapes"><li class="active">1. ${c.t('contact.e1')}</li><li>2. ${c.t('contact.e2')}</li><li>3. ${c.t('contact.e3')}</li></ol>
      <fieldset class="etape-form">
        <legend>${c.t('contact.e1Legende')}</legend>
        <div class="choix-services">${svc.map((s) => html`<label class="choix enc-${s.encre}"><input type="radio" name="service" value="${s.cle}" data-nom="${s.nom}">${s.nom}</label>`)}</div>
        <p class="champ-erreur" data-erreur-choix role="alert" hidden>${c.t('contact.erreurChoix')}</p>
        <div class="devis-nav"><button type="button" class="bouton" data-suivant>${c.t('contact.suivant')}</button></div>
      </fieldset>
      <fieldset class="etape-form" hidden>
        <legend>${c.t('contact.e2')}</legend>
        <div class="champ"><label for="f-support">${c.t('contact.support')}</label><input id="f-support" name="support" autocomplete="off" aria-describedby="f-support-aide"><p class="champ-aide" id="f-support-aide">${c.t('contact.supportAide')}</p></div>
        <div class="champ"><label for="f-delai">${c.t('contact.delai')}</label><select id="f-delai" name="delai"><option value="">${c.t('contact.delaiChoix')}</option><option value="mois">${c.t('contact.delai1')}</option><option value="trimestre">${c.t('contact.delai2')}</option><option value="libre">${c.t('contact.delai3')}</option></select></div>
        <div class="champ"><label for="f-message">${c.t('contact.message')}</label><textarea id="f-message" name="message" rows="4"></textarea></div>
        <div class="devis-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('contact.suivant')}</button></div>
      </fieldset>
      <fieldset class="etape-form" hidden>
        <legend>${c.t('contact.e3')}</legend>
        <div class="champ"><label for="f-nom">${c.t('contact.nom')} *</label><input id="f-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="f-societe">${c.t('contact.societe')}</label><input id="f-societe" name="societe" autocomplete="organization"></div>
        <div class="champ"><label for="f-email">${c.t('contact.email')} *</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="f-tel">${c.t('contact.tel')} *</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" required></div>
        <p class="mention-donnees">${c.t('contact.donnees')}</p>
        <div class="devis-nav"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.precedent')}</button><button type="submit" class="bouton" data-grille="retour">${c.t('contact.envoyer')}</button></div>
      </fieldset>
      <p data-message-envoi data-texte="${c.s('contact.envoye')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="epreuve" aria-label="${c.s('contact.recap')}" data-vide="${c.s('contact.recapVide')}">
      ${coins()}
      <p class="epreuve-tete"><span>${c.t('contact.recap')}</span><button type="button" class="lien" data-modifier>${c.t('contact.modifier')}</button></p>
      <dl>
        <div><dt>${c.t('contact.recapService')}</dt><dd data-recap="service">${c.t('contact.recapVide')}</dd></div>
        <div><dt>${c.t('contact.recapSupport')}</dt><dd data-recap="support">${c.t('contact.recapVide')}</dd></div>
        <div><dt>${c.t('contact.recapDelai')}</dt><dd data-recap="delai">${c.t('contact.recapVide')}</dd></div>
      </dl>
      ${barreControle()}
      <div class="tampon-bat" data-effet="bat" data-superpose aria-hidden="true">${tampon('tb', ['BON À', 'TIRER'])}</div>
      <div class="bannette" aria-hidden="true"></div>
    </aside>
  </div>
</section>

<section class="section section--papier2" id="acces" data-fil="gauche">
  <div class="conteneur acces">
    <div>
      <p class="surtitre enc-c" data-fil-repere>${c.t('contact.accesSurtitre')}</p>
      <h2 class="titre-section" data-anime="lignes" data-axes>${c.t('contact.accesTitre')}</h2>
      <p data-anime>${c.t('contact.accesTexte')}</p>
      <p>${c.site.contact.adresse}<br><span class="a-completer">${c.t('commun.horaires')}</span></p>
    </div>
    ${planAcces(c)}
  </div>
  <div class="conteneur">${c.media({ nom: 'grok/contact-atelier', alt: c.s('contact.atelierAlt'), classe: 'bandeau', sizes: '100vw', cadrage: '50% 60%', attrs: 'data-fx="parallaxe"' })}</div>
</section>
`;
};
