const assert = require("assert");
const NVL = require("../assets/js/logique.js");

const produits = [
  { id: "a", nom: "Tee A", categorie: "Tees", prix: 15000, tailles: ["S", "M"], nouveaute: true },
  { id: "b", nom: "Hoodie B", categorie: "Hoodies", prix: 32000, tailles: ["M", "L"], nouveaute: false },
  { id: "c", nom: "Cap C", categorie: "Accessoires", prix: 9000, tailles: ["Unique"], nouveaute: true }
];

assert.strictEqual(NVL.formaterPrix(15000), "15 000 FCFA");
assert.strictEqual(NVL.formaterPrix(0), "0 FCFA");
assert.deepStrictEqual(NVL.filtrerProduits(produits, { categorie: "Tees" }).map(p => p.id), ["a"]);
assert.deepStrictEqual(NVL.filtrerProduits(produits, { taille: "M" }).map(p => p.id).sort(), ["a", "b"]);
assert.deepStrictEqual(NVL.filtrerProduits(produits, { nouveaute: true }).map(p => p.id).sort(), ["a", "c"]);
const lignes = [{ id: "a", taille: "M", couleur: "Noir", qte: 2 }, { id: "b", taille: "L", couleur: "Teal", qte: 1 }];
assert.deepStrictEqual(NVL.calculerTotal(lignes, produits), { total: 62000, nb: 3 });
assert.deepStrictEqual(NVL.calculerTotal([], produits), { total: 0, nb: 0 });

const wa = NVL.construireMessageWhatsApp(lignes, produits, "+229 01 00 00 00");
assert.ok(wa.startsWith("https://wa.me/22901000000?text="));
assert.ok(decodeURIComponent(wa).indexOf("Total : 62 000 FCFA") !== -1);
assert.ok(decodeURIComponent(wa).indexOf("3 articles") !== -1);

console.log("logique.test.js : OK");
