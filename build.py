import os
Q = chr(34)
BASE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(BASE, "_partials")
top = open(os.path.join(P, "top.html"), encoding="utf-8").read()
bottom = open(os.path.join(P, "bottom.html"), encoding="utf-8").read()

pages = [
  ("index.html", "NOUVIVÔ — Streetwear premium à Cotonou", "NOUVIVÔ, marque de streetwear premium à Cotonou. Découvrez la collection et la signature Liberté Portée.", "", "body-index.html"),
  ("boutique.html", "Boutique — NOUVIVÔ", "Découvrez la collection streetwear NOUVIVÔ : tees, hoodies, vestes et accessoires. Prix en FCFA, livraison au Bénin.", "boutique.js", "body-boutique.html"),
  ("produit.html", "Produit — NOUVIVÔ", "Fiche produit NOUVIVÔ : photos, tailles, couleurs et commande en quelques clics.", "produit.js", "body-produit.html"),
  ("panier.html", "Panier — NOUVIVÔ", "Finalisez votre commande NOUVIVÔ : récapitulatif, livraison et commande par WhatsApp.", "panier.js", "body-panier.html"),
  ("histoire.html", "Notre histoire — NOUVIVÔ", "Le manifeste et le récit de la marque NOUVIVÔ : pourquoi elle est née, sa vision et le sens de « Nou » et « Vivô » — la parole libre.", "", "body-histoire.html"),
  ("lookbook.html", "Lookbook — NOUVIVÔ", "Le lookbook NOUVIVÔ : une galerie de looks portés, entre Cotonou et esprit streetwear.", "", "body-lookbook.html"),
  ("livraison-faq.html", "Livraison & FAQ — NOUVIVÔ", "Livraison, paiement, tailles, échanges et retours NOUVIVÔ. Toutes les réponses à vos questions.", "", "body-livraison-faq.html"),
  ("contact.html", "Contact — NOUVIVÔ", "Contactez NOUVIVÔ : formulaire, WhatsApp, Instagram et TikTok. Basé à Cotonou, Bénin.", "", "body-contact.html"),
  ("mentions-legales.html", "Mentions légales — NOUVIVÔ", "Mentions légales du site NOUVIVÔ.", "", "body-mentions-legales.html"),
  ("cgv.html", "Conditions générales de vente — NOUVIVÔ", "Conditions générales de vente NOUVIVÔ : prix, paiement, livraison, retours.", "", "body-cgv.html"),
  ("confidentialite.html", "Politique de confidentialité — NOUVIVÔ", "Politique de confidentialité NOUVIVÔ : données collectées et cookies.", "", "body-confidentialite.html"),
  ("404.html", "Page introuvable — NOUVIVÔ", "La page demandée est introuvable.", "", "body-404.html"),
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
