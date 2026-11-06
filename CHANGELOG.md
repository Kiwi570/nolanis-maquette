# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v3 — un vrai en-tête sur ordinateur

Comparaison faite entre nolanis-maquette-v2.zip et ce dossier : seuls l'en-tête, la feuille de style, `site.js` et deux textes changent (plus le numéro de version des fichiers).

**En-tête (toutes les pages)** :
- sur ordinateur, dès 900 px de large, l'en-tête tient sur deux rangées : en haut le logo, une barre de contrôle des encres avec « Communication visuelle · Strasbourg » (le texte se retire sous 1100 px), le téléphone et « Demander un devis » ;
- en dessous, la navigation en chemin de fer : les 8 pages dans des cases numérotées de 01 à 08, traits de coupe aux deux bouts ; au survol, un filet d'encre (cyan, magenta, jaune, vert-jaune) se déroule en haut de la case ; la page en cours est encrée en noir ;
- le bouton Menu ne s'affiche plus qu'en dessous de 900 px (tablette, téléphone) ;
- sans JavaScript, sous 900 px, un lien Menu ouvre le même menu plein écran, avec un lien Fermer.

**Petits écrans et confort** :
- téléphone à l'horizontale : ouvertures resserrées (accueil, objets, sauvegarde, contact, 404) pour garder le bouton principal dans le premier écran ;
- mode calme et sans JavaScript : les scènes (dépliant, chemin de fer, parcours de l'enveloppe, trajet du fichier) prennent la hauteur de leur contenu, et le dos du dépliant ne se superpose plus au texte ;
- un lien vers une scène plein écran (par exemple /publicite#chemin-de-fer) l'amène en haut de l'écran ;
- présentoir des objets sur écran bas : l'introduction se retire pour que tout tienne.
- sur petit écran, la mention « Illustration générée » des ouvertures de l'accueil et de la sauvegarde passe en haut à droite, pour ne plus couvrir de texte.

## v2 — les quatre pages manquantes

Comparaison faite entre nolanis-maquette-v1.zip et ce dossier.

**Pages ajoutées** (fichiers `publipostage.html`, `objets-publicitaires.html`, `sauvegarde.html`, `formations.html`, avec leurs images de partage) :
- **Publipostage** : ouverture plein cadre sur les casiers de tri, cachet d'oblitération qui se tamponne ; scène épinglée où l'enveloppe traverse les cinq étapes (la feuille se pose, s'imprime, entre sous pli, l'enveloppe part) ; choix du délai J+1, J+4 ou J+7 : l'enveloppe file jusqu'à la boîte, plus ou moins vite, et le bouton de devis prend ce délai ; l'e-mailing en boîte de réception réimposée.
- **Objets publicitaires** : ouverture scindée sur le vert-jaune du logo ; « Votre nom, imprimé dessus » : on tape un texte, on choisit l'objet, l'impression se fait en direct, et « Ajouter à ma demande » fait voler l'objet jusqu'au bouton Devis, qui ouvre le devis avec l'objet et le texte ; présentoir épinglé des six familles d'objets, qui se feuillettent un à un, le fond prenant la teinte de chacun.
- **Sauvegarde** : ouverture nocturne compacte, prix en très grand, cadenas qui se ferme et barre de sauvegarde incrémentale ; trajet épinglé d'un fichier (ordinateur, chiffrement, deux centres de données, partout) ; « Une panne, et après ? » : on choisit la panne, le fichier disparaît puis revient depuis la sauvegarde.
- **Formations** : ouverture dans le viseur, la photo se fait nette et les collimateurs se resserrent ; molette de mode crantée A, B, C, D à tourner (souris, doigt, flèches du clavier), chaque cran ouvre un bloc du programme ; le matériel ; appel.

**Pages modifiées** :
- navigation : les quatre pages entrent dans l'en-tête, le menu et le pied de page ; les liens « Publipostage », « Objets », « Sauvegarde » et « Formations » des services de l'accueil mènent désormais à leur page ;
- Photo & vidéo : la section Formation devient un sommaire A à D qui renvoie à la page Formations ;
- en-tête : les liens tiennent sur une ligne, le bouton Menu prend le relais dès qu'ils ne tiennent plus.

**Images** : 10 illustrations générées (Grok) en plus, toutes marquées « Illustration générée ».

**Fichiers ajoutés côté code** : `assets/js/pages-v2.js`, `donnees/objets.json`, `source/pages/` (quatre pages) ; modules de la bibliothèque repris : bac-a-feuilleter, envol-vers-le-panier.

## v1 — la base

**Pages** : Accueil, Print & Web, Publicité, Photo & vidéo, Contact et devis, 404. Chaque page a son ouverture : épreuve plein cadre à caler (accueil), grand titre centré et dépliant fermé (Print & Web), ouverture sombre scindée avec chiffres et couverture du Strassbuch (Publicité), grand titre puis table lumineuse et compte-fils (Photo & vidéo), ouverture compacte violette avec téléphone en très grand et tampon (Contact), titre tête-bêche (404).

**Direction « Bon à tirer »** : papier ivoire, noir quadri, violet Nolanis, cyan, magenta, jaune, vert-jaune du logo ; traits de coupe, repère de calage, barre de contrôle des encres ; Fraunces, Instrument Sans, JetBrains Mono hébergées.

**Mouvement** :
- intro : traits de coupe, logo imprimé en trois passages, repère qui glisse jusqu'à l'objet d'ouverture de chaque page, puis la page s'ouvre en cercle depuis lui ;
- accueil : repère de calage à faire tourner à la main (élan, doigt, clavier) ; plus il tourne vite, plus les quatre couleurs de la photo se décalent (WebGL), il ralentit et tout se cale ; gouttes d'encre quand on le lance fort ;
- voile de transition en rideau de papier, chaque pan porte une moitié du repère ;
- fil conducteur : trait de coupe dans la marge de toutes les pages, repère au bout, une pastille par section ;
- titres imprimés en quatre passages, encre qui sèche au défilement (axe « soft » de Fraunces) ;
- scènes du métier : liasse des sept épreuves (accueil), dépliant trois volets (Print & Web), chemin de fer des six emplacements (Publicité), planche contact au crayon gras (Photo) ;
- réalisations dispersées qui se calent en grille, tirages suspendus au séchoir, enveloppe du publipostage, montage vidéo au défilement ;
- retour de l'action : le devis envoyé devient une épreuve tamponnée « BON À TIRER » qui file dans la bannette ;
- mode calme complet (lien « Réduire les animations » en pied de page et dans le menu).

**Fonctionnalités** : devis en trois étapes, prérempli depuis chaque service et chaque emplacement publicitaire, récapitulatif en direct, envoi simulé ; planche contact filtrable (sujet gardé dans l'adresse) avec visionneuse ; plan d'accès dessiné ; barre Appeler / Devis sur téléphone.

**Images** : vraies réalisations et photos du site actuel, logo réel ; 15 illustrations générées (Grok), toutes marquées « Illustration générée » ; images de partage 1200×630 par page.

**Mise en ligne** : noindex, aucun Cache-Control, affichage dans un cadre autorisé (module Wix), `.vercelignore`.
