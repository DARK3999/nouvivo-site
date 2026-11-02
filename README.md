# NOUVIVO — Site web

Site vitrine et boutique du streetwear premium **NOUVIVO** (Cotonou, Bénin), signature « Liberté Portée ».

Stack : HTML5, CSS3, JavaScript et PHP, sans dépendance lourde. Mobile d’abord (360 → 1920 px).

## Pages

- `index.html` — Accueil
- `boutique.html` — Boutique (filtres catégorie, taille, tri, recherche)
- `produit.html` — Fiche produit (`?id=`)
- `panier.html` — Panier + commande WhatsApp
- `histoire.html` — Notre histoire (manifeste, récit, valeurs)
- `lookbook.html` — Galerie
- `livraison-faq.html` — Livraison & FAQ
- `contact.html` — Formulaire de contact (PHP, anti-spam)
- `cgv.html`, `mentions-legales.html`, `confidentialite.html` — pages légales

## Structure

- `assets/` — CSS, JavaScript et images
- `data/` — produits.json (catalogue), contacts, messages et admin (JSON)
- `includes/` — config.php, functions.php
- `api/` — contact.php, newsletter.php
- `admin/` — espace administration (PHP)
- `_partials/` + `build.py` — gabarits et génération des pages

## Prévisualiser en local

Le site charge le catalogue via `fetch`, il faut donc un serveur HTTP :

```bash
cd nouvivo-site
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déployer (hébergement PHP)

1. Copier tous les fichiers sur un hébergement PHP avec HTTPS.
2. Rendre le dossier `data/` accessible en écriture (chmod 775 ou 777).
3. Vérifier que `.htaccess` est actif (Apache).
## Espace administration

- URL : `/admin/login.php`
- Identifiant : `daren`
- Mot de passe par défaut : `nouvivo2026`

Important : changez ce mot de passe dès la première connexion. Modifiez le hash dans `data/admin.json` (générez-le avec `password_hash()` en PHP ou `htpasswd -nbB`).

## Personnalisation avant mise en ligne

- Numéro WhatsApp, e-mail et réseaux : `assets/js/config.js` et `includes/config.php`
- Nom de domaine : remplacez `https://www.nouvivo.com` dans `sitemap.xml` et `robots.txt`
- Catalogue : gérez-le depuis l’administration, ou éditez `data/produits.json`
- Textes légaux : à faire valider par un juriste (Code du numérique du Bénin)

## Tests

```bash
node tests/logique.test.js
node tests/affichage.test.js
```

## Contenus à fournir par Daren avant lancement

- Logo NV final (SVG/PNG) et fiche de marque
- Photos produit (plusieurs angles) et photos portées (accueil + lookbook)
- Textes : manifeste officiel, récit de marque, descriptions, FAQ
- Prix, tailles, couleurs et stocks réels
- Numéro WhatsApp et e-mail officiels
- Nom de domaine (.com ou .bj) et hébergement
- Moyens de paiement à accepter (mobile money : FedaPay ou KKiaPay)
