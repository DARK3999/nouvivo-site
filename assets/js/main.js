/* NOUVIVO - main.js : menu, compteur panier, cookies, animations */
(function () {
  "use strict";

  function lirePanier() {
    try { return JSON.parse(localStorage.getItem("nouvivo_panier") || "[]"); }
    catch (e) { return []; }
  }

  function ecrirePanier(l) { localStorage.setItem("nouvivo_panier", JSON.stringify(l)); }

  function majCompteur() {
    var el = document.getElementById("cart-count");
    if (!el) { return; }
    var nb = 0;
    lirePanier().forEach(function (l) { nb += Number(l.qte) || 0; });
    if (nb > 0) { el.textContent = String(nb); el.classList.add("is-on"); }
    else { el.classList.remove("is-on"); }
  }

  function initMenu() {
    var burger = document.getElementById("burger");
    var menu = document.getElementById("mobile-menu");
    if (!burger || !menu) { return; }
    burger.addEventListener("click", function () {
      var ouvert = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      document.body.classList.toggle("menu-ouvert", ouvert);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-ouvert");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initCookies() {
    var bandeau = document.getElementById("cookies");
    if (!bandeau) { return; }
    if (localStorage.getItem("nouvivo_cookies") === "ok") { return; }
    bandeau.classList.add("is-on");
    document.getElementById("cookies-accepter").addEventListener("click", function () {
      localStorage.setItem("nouvivo_cookies", "ok");
      localStorage.setItem("nouvivo_choix", "accepte");
      bandeau.classList.remove("is-on");
    });
    document.getElementById("cookies-refuser").addEventListener("click", function () {
      localStorage.setItem("nouvivo_cookies", "ok");
      localStorage.setItem("nouvivo_choix", "refuse");
      bandeau.classList.remove("is-on");
    });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { obs.observe(e); });
  }

  function initAnnee() {
    var el = document.getElementById("annee");
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  document.addEventListener("DOMContentLoaded", function () {
    majCompteur();
    initMenu();
    initCookies();
    initReveal();
    initAnnee();
  });

  window.NV = window.NV || {};
  window.NV.lirePanier = lirePanier;
  window.NV.ecrirePanier = ecrirePanier;
  window.NV.majCompteur = majCompteur;
})();

// Fermeture du menu mobile + accordéon FAQ
document.addEventListener("DOMContentLoaded", function () {
  var fermer = document.getElementById("fermer-menu");
  if (fermer) {
    fermer.addEventListener("click", function () {
      var menu = document.getElementById("mobile-menu");
      var burger = document.getElementById("burger");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-ouvert");
      burger.setAttribute("aria-expanded", "false");
    });
  }
  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__item");
      var rep = item.querySelector(".faq__r");
      var ouvert = item.classList.toggle("is-open");
      rep.style.maxHeight = ouvert ? rep.scrollHeight + "px" : "0";
    });
  });
});
