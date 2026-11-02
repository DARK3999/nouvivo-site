import os
Q = chr(34)
BASE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(BASE, "_partials")
top = open(os.path.join(P, "top.html"), encoding="utf-8").read()
bottom = open(os.path.join(P, "bottom.html"), encoding="utf-8").read()

pages = [
  ("index.html", "NOUVIVO — Streetwear premium à Cotonou", "NOUVIVO, marque de streetwear premium à Cotonou. Découvrez la collection et la signature Liberté Portée.", "", "body-index.html"),
  ("boutique.html", "Boutique — NOUVIVO", "Découvrez la collection streetwear NOUVIVO : tees, hoodies, vestes et accessoires. Prix en FCFA, livraison au Bénin.", "boutique.js", "body-boutique.html"),
  ("produit.html", "Produit — NOUVIVO", "Fiche produit NOUVIVO : photos, tailles, couleurs et commande en quelques clics.", "produit.js", "body-produit.html"),
  ("panier.html", "Panier — NOUVIVO", "Finalisez votre commande NOUVIVO : récapitulatif, livraison et commande par WhatsApp.", "panier.js", "body-panier.html"),
  ("histoire.html", "Notre histoire — NOUVIVO", "Le manifeste et le récit de la marque NOUVIVO : pourquoi elle est née, sa vision et le sens de Vivo.", "", "body-histoire.html"),
  ("lookbook.html", "Lookbook — NOUVIVO", "Le lookbook NOUVIVO : une galerie de looks portés, entre Cotonou et esprit streetwear.", "", "body-lookbook.html"),
  ("livraison-faq.html", "Livraison & FAQ — NOUVIVO", "Livraison, paiement, tailles, échanges et retours NOUVIVO. Toutes les réponses à vos questions.", "", "body-livraison-faq.html"),
  ("contact.html", "Contact — NOUVIVO", "Contactez NOUVIVO : formulaire, WhatsApp, Instagram et TikTok. Basé à Cotonou, Bénin.", "", "body-contact.html"),
  ("mentions-legales.html", "Mentions légales — NOUVIVO", "Mentions légales du site NOUVIVO.", "", "body-mentions-legales.html"),
  ("cgv.html", "Conditions générales de vente — NOUVIVO", "Conditions générales de vente NOUVIVO : prix, paiement, livraison, retours.", "", "body-cgv.html"),
  ("confidentialite.html", "Politique de confidentialité — NOUVIVO", "Politique de confidentialité NOUVIVO : données collectées et cookies.", "", "body-confidentialite.html"),
  ("404.html", "Page introuvable — NOUVIVO", "La page demandée est introuvable.", "", "body-404.html"),
]

for fn, title, desc, script, bodyfile in pages:
    body = open(os.path.join(P, bodyfile), encoding="utf-8").read()
    script_tag = ""
    if script:
        script_tag = "<script src=" + Q + "assets/js/" + script + Q + "></script>"
    html = top.replace("{{TITLE}}", title).replace("{{DESC}}", desc)
    html += body
    html += bottom.replace("{{SCRIPT}}", script_tag)
    open(os.path.join(BASE, fn), "w", encoding="utf-8").write(html)
    print("OK", fn)
