/* NOUVIVO - panier.js : récapitulatif, quantités, livraison, commande WhatsApp */
(function () {
  "use strict";
  var produits = [];
  var zones = {
    cotonou: { nom: "Cotonou", frais: 1000 },
    calavi: { nom: "Abomey-Calavi", frais: 1500 },
    benin: { nom: "Autre ville du Benin", frais: 2500 },
    diaspora: { nom: "Diaspora / Afrique de l Ouest", frais: null }
  };

  function charger() {
    fetch("data/produits.json")
      .then(function (r) { return r.json(); })
      .then(function (d) { produits = d.produits || []; rendre(); })
      .catch(function () { rendre(); });
  }

  function rendre() {
    var panier = window.NV.lirePanier();
    var conteneur = document.getElementById("panier-lignes");
    var vide = document.getElementById("panier-vide");
    var corps = document.getElementById("panier-corps");
    if (panier.length === 0) {
      if (vide) { vide.style.display = "block"; }
      if (corps) { corps.style.display = "none"; }
      return;
    }
    if (vide) { vide.style.display = "none"; }
    if (corps) { corps.style.display = "block"; }
    conteneur.innerHTML = "";
    panier.forEach(function (l) {
      var p = window.NVL.trouver(produits, l.id);
      if (!p) { return; }
      var el = document.createElement("div");
      el.className = "panier__ligne";
      el.innerHTML = `<div class="panier__img"><img src="${p.images[0]}" alt="${p.nom}"></div><div class="panier__info"><h3>${p.nom}</h3><p>Taille ${l.taille} - Couleur ${l.couleur}</p><button class="panier__retirer" data-id="${l.id}" data-taille="${l.taille}" data-couleur="${l.couleur}">Retirer</button></div><div class="qte"><button data-act="moins">-</button><span>${l.qte}</span><button data-act="plus">+</button></div><div class="panier__prix">${window.NVL.formaterPrix(p.prix * l.qte)}</div>`;
      el.dataset.id = l.id; el.dataset.taille = l.taille; el.dataset.couleur = l.couleur;
      conteneur.appendChild(el);
    });
    conteneur.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", fonctionBouton); });
    majResume();
  }

  function fonctionBouton(e) {
    var ligne = e.target.closest(".panier__ligne");
    var id = ligne.dataset.id, taille = ligne.dataset.taille, couleur = ligne.dataset.couleur;
    var act = e.target.dataset.act;
    var panier = window.NV.lirePanier();
    var idx = -1;
    panier.forEach(function (l, i) { if (l.id === id && l.taille === taille && l.couleur === couleur) { idx = i; } });
    if (idx === -1) { return; }
    if (act === "retirer") { panier.splice(idx, 1); }
    else if (act === "plus") { panier[idx].qte += 1; }
    else if (act === "moins") { panier[idx].qte -= 1; if (panier[idx].qte <= 0) { panier.splice(idx, 1); } }
    window.NV.ecrirePanier(panier);
    window.NV.majCompteur();
    rendre();
  }

  function majResume() {
    var panier = window.NV.lirePanier();
    var t = window.NVL.calculerTotal(panier, produits);
    setText("resume-nb", String(t.nb) + " article" + (t.nb > 1 ? "s" : ""));
    setText("resume-sous-total", window.NVL.formaterPrix(t.total));
    var zone = document.getElementById("champ-zone");
    var z = zones[zone ? zone.value : "cotonou"];
    var frais = z.frais;
    setText("resume-frais", frais === null ? "Sur devis" : window.NVL.formaterPrix(frais));
    setText("resume-total", frais === null ? window.NVL.formaterPrix(t.total) + " + livraison" : window.NVL.formaterPrix(t.total + frais));
  }

  function commandeWhatsApp() {
    var panier = window.NV.lirePanier();
    if (panier.length === 0) { return; }
    var t = window.NVL.calculerTotal(panier, produits);
    var zone = document.getElementById("champ-zone");
    var z = zones[zone ? zone.value : "cotonou"];
    var nom = document.getElementById("champ-nom").value;
    var tel = document.getElementById("champ-tel").value;
    var NL = String.fromCharCode(10);
    var msg = "Bonjour NOUVIVÔ ! Je souhaite commander :" + NL + NL;
    panier.forEach(function (l) {
      var p = window.NVL.trouver(produits, l.id);
      if (!p) { return; }
      msg += "- " + p.nom + " | Taille " + l.taille + " | Couleur " + l.couleur + " | x" + l.qte + NL;
    });
    msg += NL + "Total : " + window.NVL.formaterPrix(t.total);
    msg += NL + "Livraison : " + z.nom + (z.frais === null ? " (sur devis)" : " (" + window.NVL.formaterPrix(z.frais) + ")");
    if (nom) { msg += NL + "Nom : " + nom; }
    if (tel) { msg += NL + "Telephone : " + tel; }
    var numero = window.NVL.chiffres(window.NV_CONFIG.whatsapp);
    window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(msg), "_blank");
  }

  function setText(id, v) { var el = document.getElementById(id); if (el) { el.textContent = v; } }

  document.addEventListener("DOMContentLoaded", function () {
    charger();
    var zone = document.getElementById("champ-zone");
    if (zone) { zone.addEventListener("change", majResume); }
    var b = document.getElementById("panier-whatsapp");
    if (b) { b.addEventListener("click", commandeWhatsApp); }
  });
})();
