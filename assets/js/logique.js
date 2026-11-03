/* NOUVIVO - logique.js | fonctions pures (testables avec Node) : prix, filtres, panier, message WhatsApp */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) { module.exports = factory(); }
  else { root.NVL = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var NL = String.fromCharCode(10);

  function formaterPrix(n) {
    n = Number(n) || 0;
    var s = String(n), out = "", c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s[i] + out; c++;
      if (c % 3 === 0 && i > 0) { out = " " + out; }
    }
    return out + " FCFA";
  }

  function trouver(produits, id) {
    produits = produits || [];
    for (var i = 0; i < produits.length; i++) { if (produits[i].id === id) { return produits[i]; } }
    return null;
  }

  function filtrerProduits(produits, options) {
    options = options || {};
    var liste = (produits || []).slice();
    if (options.categorie && options.categorie !== "Tout") { liste = liste.filter(function (p) { return p.categorie === options.categorie; }); }
    if (options.taille && options.taille !== "Toutes") { liste = liste.filter(function (p) { return (p.tailles || []).indexOf(options.taille) !== -1; }); }
    if (options.nouveaute) { liste = liste.filter(function (p) { return p.nouveaute === true; }); }
    if (options.recherche) {
      var q = String(options.recherche).toLowerCase();
      liste = liste.filter(function (p) { return (p.nom + " " + (p.description || "")).toLowerCase().indexOf(q) !== -1; });
    }
    if (options.tri === "prix-asc") { liste.sort(function (a, b) { return a.prix - b.prix; }); }
    else if (options.tri === "prix-desc") { liste.sort(function (a, b) { return b.prix - a.prix; }); }
    else if (options.tri === "nouveau") { liste.sort(function (a, b) { return (b.nouveaute ? 1 : 0) - (a.nouveaute ? 1 : 0); }); }
    return liste;
  }

  function calculerTotal(lignes, produits) {
    var total = 0, nb = 0;
    (lignes || []).forEach(function (l) {
      var p = trouver(produits, l.id);
      var prix = p ? (p.prix || 0) : 0;
      var q = Number(l.qte) || 0;
      total += prix * q; nb += q;
    });
    return { total: total, nb: nb };
  }

  function chiffres(s) {
    return String(s || "").split("").filter(function (c) { return c >= "0" && c <= "9"; }).join("");
  }

  function construireMessageWhatsApp(lignes, produits, numero) {
    var tel = chiffres(numero);
    var t = calculerTotal(lignes, produits);
    var msg = "Bonjour NOUVIVÔ ! Je souhaite commander :" + NL + NL;
    (lignes || []).forEach(function (l) {
      var p = trouver(produits, l.id);
      if (!p) { return; }
      msg += "- " + p.nom + " | Taille " + l.taille + " | Couleur " + l.couleur + " | x" + l.qte + NL;
    });
    msg += NL + "Total : " + formaterPrix(t.total) + " (" + t.nb + " article" + (t.nb > 1 ? "s" : "") + ")";
    return "https://wa.me/" + tel + "?text=" + encodeURIComponent(msg);
  }

  return { formaterPrix: formaterPrix, filtrerProduits: filtrerProduits, calculerTotal: calculerTotal, construireMessageWhatsApp: construireMessageWhatsApp, chiffres: chiffres, trouver: trouver };
});
