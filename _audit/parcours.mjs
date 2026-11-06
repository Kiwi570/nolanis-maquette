/* Parcours propres à Nolanis : devis en trois étapes (choix prérempli, tampon BON À TIRER, double envoi),
   filtres de la planche contact (adresse, nombre), visionneuse (Échap, flèches, focus rendu). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const { ctx, page } = await contexte({ taille: T('390×844') });
  try {
    /* Devis prérempli depuis un bouton de service : on arrive à l'étape du projet, le récapitulatif affiche le service. */
    await page.goto(BASE + '/contact?service=publicite&support=amicale-livret#devis', { waitUntil: 'load' });
    await attendrePret(page);
    const pre = await page.evaluate(() => ({
      etape: [...document.querySelectorAll('.etape-form')].findIndex((e) => !e.hidden),
      service: document.querySelector('[data-recap="service"]')?.textContent.trim(),
      support: document.querySelector('#f-support')?.value,
    }));
    if (pre.etape !== 1) R.echec('devis', `arrivée avec ?service : étape ${pre.etape + 1} affichée au lieu de 2`, { page: '/contact', taille: '390×844' });
    if (pre.service !== 'Publicité') R.echec('devis', `récapitulatif du service : « ${pre.service} »`, { page: '/contact', taille: '390×844' });
    if (!/livret annuel/i.test(pre.support || '')) R.echec('devis', `support prérempli : « ${pre.support} »`, { page: '/contact', taille: '390×844' });
    /* Étape 3, champs vides : l'envoi est refusé, erreurs à côté des champs. */
    await page.locator('.etape-form:not([hidden]) [data-suivant]').click();
    await attendre(400);
    await page.locator('.etape-form:not([hidden]) [type="submit"]').click();
    await attendre(300);
    const erreurs = await page.locator('.champ-erreur:not(:empty)').count();
    if (erreurs < 2) R.echec('devis', 'envoi accepté avec des champs obligatoires vides', { page: '/contact', taille: '390×844' });
    /* Champs remplis : envoi simulé, tampon posé, bouton désactivé (pas de double envoi). */
    await page.fill('#f-nom', 'Camille Test');
    await page.fill('#f-email', 'camille@exemple.fr');
    await page.fill('#f-tel', '06 12 34 56 78');
    await page.locator('[type="submit"]').click();
    await attendre(1600);
    const apres = await page.evaluate(() => ({
      tampon: document.querySelector('.epreuve')?.classList.contains('tamponnee'),
      desactive: document.querySelector('[data-devis] [type="submit"]')?.disabled,
      message: !document.querySelector('[data-message-envoi]')?.hidden,
    }));
    if (!apres.tampon) R.echec('devis', 'le tampon BON À TIRER ne se pose pas après l’envoi', { page: '/contact', taille: '390×844' });
    if (!apres.desactive) R.echec('devis', 'bouton d’envoi encore actif après l’envoi (double envoi possible)', { page: '/contact', taille: '390×844' });
    if (!apres.message) R.echec('devis', 'message « simulé » absent après l’envoi', { page: '/contact', taille: '390×844' });

    /* Planche contact : filtre gardé dans l'adresse, nombre de photos juste, visionneuse au clavier. */
    await page.goto(BASE + '/photo-video?sujet=animaux#planche', { waitUntil: 'load' });
    await attendrePret(page);
    await attendre(400);
    const f = await page.evaluate(() => ({
      presse: document.querySelector('.filtre[aria-pressed="true"]')?.dataset.filtre,
      visibles: [...document.querySelectorAll('.vignette')].filter((v) => !v.hidden).length,
      attendues: [...document.querySelectorAll('.vignette[data-cat="animaux"]')].length,
    }));
    if (f.presse !== 'animaux' || f.visibles !== f.attendues) R.echec('filtres', `filtre de l’adresse : ${f.presse}, ${f.visibles} photos au lieu de ${f.attendues}`, { page: '/photo-video', taille: '390×844' });
    await page.locator('.filtre[data-filtre="cuisine"]').click();
    await attendre(500);
    if (!page.url().includes('sujet=cuisine')) R.echec('filtres', 'le filtre choisi n’est pas gardé dans l’adresse', { page: '/photo-video', taille: '390×844' });
    const premiere = page.locator('.vignette:not([hidden])').first();
    await premiere.click();
    await attendre(300);
    const ouverte = await page.evaluate(() => document.querySelector('.visionneuse')?.classList.contains('ouverte'));
    if (!ouverte) R.echec('visionneuse', 'la visionneuse ne s’ouvre pas depuis la vignette', { page: '/photo-video', taille: '390×844' });
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await attendre(200);
    const fermee = await page.evaluate(() => !document.querySelector('.visionneuse')?.classList.contains('ouverte') && document.activeElement?.classList.contains('vignette'));
    if (!fermee) R.echec('visionneuse', 'Échap ne ferme pas la visionneuse ou le focus ne revient pas à la vignette', { page: '/photo-video', taille: '390×844' });
  } finally { await ctx.close(); }
}
