/* NOUVIVO - produit.js : fiche produit dynamique (?id=) */
(function () {
  "use strict";
  var produit = null;
  var choix = { taille: null, couleur: null, qte: 1 };

  function charger() {
    var id = new URLSearchParams(window.location.search).get("id");
    if (!id) { afficherErreur(); return; }
    fetch("data/produits.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        produit = window.NVL.trouver(d.produits || [], id);
        if (!produit) { afficherErreur(); return; }
        rendre();
      })
      .catch(function () { afficherErreur(); });
  }

  function rendre() {
    document.title = produit.nom + " - NOUVIVÔ";
    setText("p-nom", produit.nom);
    setText("p-prix", window.NVL.formaterPrix(produit.prix));
    setText("p-desc", produit.description);
    setText("p-cat", produit.categorie);
    if (produit.ancienPrix) { setHtml("p-ancien", `<s>${window.NVL.formaterPrix(produit.ancienPrix)}</s>`); }
    var main = document.getElementById("p-image");
    var vignettes = document.getElementById("p-vignettes");
    if (main) { main.src = produit.images[0]; main.alt = produit.nom; }
    if (vignettes) {
      vignettes.innerHTML = "";
      produit.images.forEach(function (img, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = i === 0 ? "is-active" : "";
        b.innerHTML = `<img src="${img}" alt="${produit.nom} vue ${i + 1}">`;
        b.addEventListener("click", function () {
          main.src = img;
          vignettes.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); });
          b.classList.add("is-active");
        });
        vignettes.appendChild(b);
      });
    }
    var stock = document.getElementById("p-stock");
    if (stock) {
      if (produit.stock > 0) { stock.innerHTML = `<i></i> En stock`; }
      else { stock.innerHTML = `<i></i> Epuise`; stock.classList.add("stock--epuise"); }
    }
    rendreOptions();
    var ajouter = document.getElementById("p-ajouter");
    if (ajouter) { ajouter.addEventListener("click", ajouterPanier); }
    var wa = document.getElementById("p-whatsapp");
    if (wa) { wa.addEventListener("click", commanderWhatsApp); }
  }

  function setText(id, v) { var el = document.getElementById(id); if (el) { el.textContent = v; } }
  function setHtml(id, h) { var el = document.getElementById(id); if (el) { el.innerHTML = h; } }

  function rendreOptions() {
    var couleurs = document.getElementById("p-couleurs");
    if (couleurs) {
      couleurs.innerHTML = "";
      produit.couleurs.forEach(function (c, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "puce" + (i === 0 ? " is-active" : "");
        b.textContent = c;
        b.addEventListener("click", function () { choix.couleur = c; marquer(couleurs, b); });
        couleurs.appendChild(b);
      });
      choix.couleur = produit.couleurs[0];
    }
    var tailles = document.getElementById("p-tailles");
    if (tailles) {
      tailles.innerHTML = "";
      produit.tailles.forEach(function (t, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "puce" + (i === 0 ? " is-active" : "");
        b.textContent = t;
        b.addEventListener("click", function () { choix.taille = t; marquer(tailles, b); });
        tailles.appendChild(b);
      });
      choix.taille = produit.tailles[0];
    }
    var qte = document.getElementById("p-qte");
    var moins = document.getElementById("p-moins");
    var plus = document.getElementById("p-plus");
    if (moins) { moins.addEventListener("click", function () { if (choix.qte > 1) { choix.qte--; qte.textContent = String(choix.qte); } }); }
    if (plus) { plus.addEventListener("click", function () { choix.qte++; qte.textContent = String(choix.qte); }); }
  }

  function marquer(groupe, bouton) {
    groupe.querySelectorAll(".puce").forEach(function (x) { x.classList.remove("is-active"); });
    bouton.classList.add("is-active");
  }

  function ajouterPanier() {
    if (!produit) { return; }
    var panier = window.NV.lirePanier();
    var idx = -1;
    panier.forEach(function (l, i) { if (l.id === produit.id && l.taille === choix.taille && l.couleur === choix.couleur) { idx = i; } });
    if (idx >= 0) { panier[idx].qte += choix.qte; }
    else { panier.push({ id: produit.id, taille: choix.taille, couleur: choix.couleur, qte: choix.qte }); }
    window.NV.ecrirePanier(panier);
    window.NV.majCompteur();
    var ok = document.getElementById("p-ajout-ok");
    if (ok) { ok.classList.add("is-on"); setTimeout(function () { ok.classList.remove("is-on"); }, 2500); }
  }

  function commanderWhatsApp() {
    if (!produit) { return; }
    var ligne = [{ id: produit.id, taille: choix.taille, couleur: choix.couleur, qte: choix.qte }];
    var url = window.NVL.construireMessageWhatsApp(ligne, [produit], window.NV_CONFIG.whatsapp);
    window.open(url, "_blank");
  }

  function afficherErreur() {
    document.body.innerHTML = `<main class="container section"><h1>Produit introuvable</h1><p>Cet article est introuvable ou a ete retire.</p><a class="btn" href="boutique.html">Voir la boutique</a></main>`;
  }

  document.addEventListener("DOMContentLoaded", charger);
})();
