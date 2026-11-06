# Nolanis — maquette « Bon à tirer » (v1)

Maquette du futur site de Nolanis, agence de communication visuelle à Strasbourg.
Adresse de démonstration : https://nolanis-maquette.vercel.app

Site statique (HTML, CSS, JavaScript), généré depuis les fichiers de `donnees/` par `node outils/generer.mjs`.
Ne jamais modifier les pages `*.html` à la main : elles sont réécrites à chaque génération.

## Pages de la v1

Accueil · Print & Web · Publicité · Photo & vidéo · Contact et devis · 404.
Pages du site actuel non reprises (disponibles en v2) : Publipostage, Objets publicitaires, Sauvegarde, Formations (présentées sur l'accueil, avec un devis prérempli).

## Direction artistique

« Bon à tirer » : papier ivoire, noir quadri, violet Nolanis, cyan, magenta, jaune et le vert-jaune du logo (ton direct).
Polices : Fraunces (titres, axe « soft » animé), Instrument Sans (texte), JetBrains Mono (cotes), hébergées dans `assets/polices/` (licence OFL jointe).

## À fournir par Nolanis (à compléter)

- Nom à retenir : Nolanis ou Optemis (le site actuel utilise les deux : domaine, logo, e-mail et légendes « Réalisation Optemis »).
- Adresse : 1, place de l'Homme de Fer (page contact) ou 10, chemin des Violettes (mentions légales) ?
- Mentions légales : raison sociale, forme juridique, SIRET ou RCS (« en cours d'immatriculation » sur le site actuel), capital, directeur de la publication.
- Hébergeur : Vercel Inc., adresse à vérifier sur vercel.com au moment de la mise en ligne.
- Politique de confidentialité (RGPD) : données recueillies par le formulaire, finalité, durée, droits.
- Horaires d'ouverture.
- E-mail au nom de Nolanis, si l'adresse contact@optemis.com doit changer.
- Tarifs et formats des espaces publicitaires (Strassbuch, Amicale du Conseil de l'Europe).
- Tarifs détaillés de la sauvegarde (le site actuel renvoie à un PDF) ; source des chiffres « 37 % » et « 2 PME sur 5 » s'ils doivent être repris.
- Formation photo : durée, public, tarif, éventuelle certification.
- Extraits vidéo (prise de vue réelle et motion design) : la frise de montage de la page Photo & vidéo est illustrative.
- Assurances et qualifications, si elles doivent figurer.

## Crédits des images

- Photos de réalisations, logo, couvertures et réalisations print et web : site actuel de Nolanis (optemis.com).
- Illustrations générées par IA (Grok) : ouvertures de l'accueil et de la page Publicité, papeterie vierge, écran, enveloppes, sauvegarde, matériel photo, papier coton, encre au rouleau, livret, table lumineuse, établi, 404. Elles portent la mention « Illustration générée » : **la garder sur le site final**.
- Illustrations de banque d'images du site actuel écartées (contact, sauvegarde, formations, photographe, publipostage, partenaires).

## À retirer à la mise en ligne définitive

- `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`.
- Formulaire de devis simulé (rien n'est envoyé) : à brancher sur un vrai envoi.
- Frise de montage vidéo illustrative.
- Toutes les mentions « à compléter », une fois les informations fournies.

À garder : la mention « Illustration générée » sur les images créées par IA.

## Commandes utiles

```
node outils/generer.mjs            pages HTML depuis donnees/ et source/
node outils/images-partage.mjs     images de partage 1200×630 (assets/partage/)
node _audit/audit.mjs              audit standard (rapport dans _audit/rapport/)
```
