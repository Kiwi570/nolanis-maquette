/* 404 : « partie au pilon ». Titre tête-bêche qui se remet droit, feuilles mal calées. */
import { html } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="op-404" id="debut" data-section>
  <div>
    <div data-iris-centre="disque" style="width:64px;height:64px">${repere()}</div>
    <p class="surtitre enc-m" data-anime="gsap">${c.t('introuvable.surtitre')}</p>
    <h1 class="quadri" data-effet="pilon"><span class="hero-ligne">${c.t('introuvable.titre')}</span></h1>
    <p data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p data-anime="gsap">${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}</p>
  </div>
  ${c.media({ nom: 'grok/404-pilon', alt: c.s('introuvable.alt'), priorite: true, sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
</section>
`;
