/* NOUVIVO - boutique.js : grille de produits, filtres, tri */
(function () {
  "use strict";
  var produits = [];
  var etat = { categorie: "Tout", taille: "Toutes", tri: "defaut", recherche: "", nouveaute: false };

  function lireParams() {
    var q = new URLSearchParams(window.location.search);
    if (q.get("nouveaute") === "1") { etat.nouveaute = true; }
    var c = q.get("categorie");
    if (c) { etat.categorie = c; }
  }

  function charger() {
    fetch("data/produits.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        produits = d.produits || [];
        lireParams();
        construireFiltres();
        rendre();
      })
      .catch(function () { afficherVide("Impossible de charger le catalogue."); });
  }

  function construireFiltres() {
    var cats = ["Tout"];
    produits.forEach(function (p) { if (cats.indexOf(p.categorie) === -1) { cats.push(p.categorie); } });
    var conteneur = document.getElementById("filtres-categories");
    conteneur.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "puce" + (c === etat.categorie ? " is-active" : "");
      b.textContent = c;
      b.addEventListener("click", function () {
        etat.categorie = c; etat.nouveaute = false;
        conteneur.querySelectorAll(".puce").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        rendre();
      });
      conteneur.appendChild(b);
    });
    var tailles = ["Toutes", "S", "M", "L", "XL", "XXL", "Unique"];
    var sel = document.getElementById("filtres-tailles");
    sel.innerHTML = "";
    tailles.forEach(function (t) {
      var o = document.createElement("option");
      o.value = t;
      o.textContent = (t === "Toutes" ? "Toutes les tailles" : "Taille " + t);
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () { etat.taille = sel.value; rendre(); });
    document.getElementById("filtres-tri").addEventListener("change", function (e) { etat.tri = e.target.value; rendre(); });
    document.getElementById("filtres-recherche").addEventListener("input", function (e) { etat.recherche = e.target.value; rendre(); });
  }

  function rendre() {
    var conteneur = document.getElementById("grille-produits");
    var compte = document.getElementById("compte-produits");
    var liste = window.NVL.filtrerProduits(produits, etat);
    if (compte) { compte.textContent = liste.length + " article" + (liste.length > 1 ? "s" : ""); }
    if (liste.length === 0) { conteneur.innerHTML = `<p>Aucun article ne correspond a vos filtres.</p>`; return; }
    conteneur.innerHTML = liste.map(carteProduit).join("");
  }

  function carteProduit(p) {
    var badge = p.nouveaute ? `<span class="carte__badge">Nouveau</span>` : "";
    var ancien = p.ancienPrix ? `<s>${window.NVL.formaterPrix(p.ancienPrix)}</s>` : "";
    return `<a class="carte" href="produit.html?id=${p.id}"><div class="carte__media"><img src="${p.images[0]}" alt="${p.nom}" loading="lazy"></div>${badge}<div class="carte__corps"><div class="carte__cat">${p.categorie}</div><h3 class="carte__nom">${p.nom}</h3><div class="carte__prix">${ancien}${window.NVL.formaterPrix(p.prix)}</div></div></a>`;
  }

  function afficherVide(msg) {
    var c = document.getElementById("grille-produits");
    if (c) { c.innerHTML = `<p>${msg}</p>`; }
  }

  document.addEventListener("DOMContentLoaded", charger);
})();
