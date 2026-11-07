# Rapport d’audit

Projet : `nolanis-maquette` · 07/11/2026 18:13:28 · 6 min · 1 page(s) · audit complet ciblé sur /print-web

## Résumé

- Échecs : **0**
- À regarder : **4**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (52), balayage (1), films d’ouverture (2), films de transition (2), bords de l’écran (2), intro accélérable et passable (7), menu (1), clavier (1), liens et boutons (1), liens profonds (4), liens vers la page en cours (1), changements de hauteur (1), mode calme (2), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), films des épinglages (1), fluidité (2), défilement selon l’appareil (5), mouvement (2), effets du plan (37), souris immobile (2), vitesse (1), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil et 1 autre(s) page(s) |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 9 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en rideau |
| 4. Un fil conducteur traverse le site | ✓ présent | sur les 9 page(s) |
| 5. La typographie bouge aussi | ✓ présent | sur les 9 page(s) |
| 6. Les scènes épinglées sont des gestes du métier | ✓ présent | geste du métier sur /, /objets-publicitaires, /print-web, /publicite, /publipostage, /sauvegarde |
| 7. L’action principale a un retour physique | ✓ présent | sur /contact, /objets-publicitaires, /publipostage |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

Aucun.

## À regarder

### journal du projet (1)

- **journal du projet** — aucune entrée pour la version 4 de donnees/site.json

### retour avant : changement brusque (2)

- **retour avant : changement brusque** — `/publicite` — à 75 ms (différence 58 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_
- **retour avant : changement brusque** — `/publicite` — à 75 ms (différence 51 %) (films/retour-avant-390.png) _(390×844 retour avant)_

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/print-web` — à 75 ms (différence 49 %) (films/retour-arrière-390.png) _(390×844 retour arrière)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=4
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture /print-web (1366×768) : 2777 ms depuis le premier octet
- Ouverture /print-web (390×844) : 2758 ms depuis le premier octet
- film de l'ouverture /print-web 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 86 images d’intro, 4 de voile et 66 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Fluidité /print-web 1366×768 (molette) : 1 % d'images lentes sur 273, tâche la plus longue 79 ms
- Fluidité /print-web 390×844 (doigt) : 0 % d'images lentes sur 1337, tâche la plus longue 0 ms
- Vitesse /print-web : 0.35 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
