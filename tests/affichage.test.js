const assert = require("assert");
const fs = require("fs");
const path = require("path");
const RACINE = path.join(__dirname, "..");

const produits = JSON.parse(fs.readFileSync(path.join(RACINE, "data/produits.json"), "utf8")).produits;
assert.ok(Array.isArray(produits) && produits.length >= 6, "catalogue insuffisant");
produits.forEach((p) => {
  assert.ok(p.id && p.nom, "produit sans id/nom");
  assert.ok(typeof p.prix === "number" && p.prix > 0, "prix invalide");
  assert.ok(Array.isArray(p.tailles) && p.tailles.length, "tailles manquantes");
  assert.ok(Array.isArray(p.couleurs) && p.couleurs.length, "couleurs manquantes");
  assert.ok(Array.isArray(p.images) && p.images.length, "images manquantes");
});

const pages = ["index.html", "boutique.html", "produit.html", "panier.html", "histoire.html", "lookbook.html", "livraison-faq.html", "contact.html", "cgv.html", "mentions-legales.html", "confidentialite.html", "404.html"];
pages.forEach((p) => {
  const f = path.join(RACINE, p);
  assert.ok(fs.existsSync(f), "page manquante : " + p);
  const c = fs.readFileSync(f, "utf8");
  assert.ok(c.indexOf("<!doctype html>") !== -1, "doctype manquant : " + p);
  assert.ok(c.indexOf("site-header") !== -1, "header manquant : " + p);
  assert.ok(c.indexOf("pied") !== -1, "footer manquant : " + p);
});
produits.forEach((p) => {
  p.images.forEach((img) => {
    assert.ok(fs.existsSync(path.join(RACINE, img)), "image manquante : " + img);
  });
});

["assets/css/style.css", "assets/js/logique.js", "assets/js/main.js", "assets/js/boutique.js", "assets/js/produit.js", "assets/js/panier.js", "includes/config.php", "api/contact.php", "api/newsletter.php", "admin/login.php", "admin/produits.php", "robots.txt", "sitemap.xml"].forEach((f) => {
  assert.ok(fs.existsSync(path.join(RACINE, f)), "fichier manquant : " + f);
});

console.log("affichage.test.js : OK");
