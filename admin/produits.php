<?php
require_once __DIR__ . "/../includes/functions.php";
nv_exiger_admin();

$produits = nv_lire_json(NV_FICHIER_PRODUITS, []);
$liste = isset($produits["produits"]) ? $produits["produits"] : [];
$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"] ?? "";

    if ($action === "supprimer") {
        $id = nv_nettoyer($_POST["id"] ?? "");
        $liste = array_values(array_filter($liste, function ($p) use ($id) { return ($p["id"] ?? "") !== $id; }));
        $produits["produits"] = $liste;
        nv_ecrire_json(NV_FICHIER_PRODUITS, $produits);
        $message = "Produit supprimé.";
    }

    if ($action === "enregistrer") {
        $id = nv_nettoyer($_POST["id"] ?? "");
        if ($id === "") { $id = "produit-" . time(); }
        $donnees = [
            "id" => $id,
            "nom" => nv_nettoyer($_POST["nom"] ?? ""),
            "categorie" => nv_nettoyer($_POST["categorie"] ?? "Tees"),
            "nouveaute" => ($_POST["nouveaute"] ?? "") === "1",
            "prix" => (int) ($_POST["prix"] ?? 0),
            "ancienPrix" => ($_POST["ancienPrix"] ?? "") === "" ? null : (int) $_POST["ancienPrix"],
            "couleurs" => nv_liste($_POST["couleurs"] ?? ""),
            "tailles" => nv_liste($_POST["tailles"] ?? ""),
            "stock" => (int) ($_POST["stock"] ?? 0),
            "description" => nv_nettoyer($_POST["description"] ?? ""),
            "images" => ["assets/img/ph-tee.svg"],
        ];
        $trouve = false;
        foreach ($liste as $i => $p) {
            if (($p["id"] ?? "") === $id) { $liste[$i] = $donnees; $trouve = true; break; }
        }
        if (!$trouve) { $liste[] = $donnees; }
        $produits["produits"] = $liste;
        nv_ecrire_json(NV_FICHIER_PRODUITS, $produits);
        $message = "Produit enregistré.";
    }
}

$edition = null;
$id_edition = $_GET["editer"] ?? "";
if ($id_edition !== "") {
    foreach ($liste as $p) { if (($p["id"] ?? "") === $id_edition) { $edition = $p; break; } }
}
$ed = (array) $edition;
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Produits — Administration NOUVIVO</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<main class="container" style="max-width:960px;padding-block:40px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<a class="logo" href="../index.html"><img src="../assets/img/logo-nv.svg" alt="NOUVIVO" width="34" height="34"><span>NOUVIVO</span></a>
<div><a class="btn btn--sm btn--ghost" href="index.php">Tableau de bord</a> <a class="btn btn--sm btn--ghost" href="logout.php">Déconnexion</a></div>
</div>
<h1 style="font-size:1.6rem;margin-top:24px">Produits</h1>
<?php if ($message): ?><div class="alerte alerte--ok is-on"><?php echo $message; ?></div><?php endif; ?>
<div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
<?php foreach ($liste as $p): ?>
<?php $pnom = $p["nom"] ?? ""; $pcat = $p["categorie"] ?? ""; $pprix = $p["prix"] ?? 0; $pid = $p["id"] ?? ""; ?>
<div style="display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--ligne);border-radius:var(--radius);padding:12px 16px">
<div style="flex:1"><strong><?php echo $pnom; ?></strong> <span class="muted">— <?php echo $pcat; ?> · <?php echo $pprix; ?> FCFA</span></div>
<a class="btn btn--sm btn--ghost" href="produits.php?editer=<?php echo urlencode($pid); ?>">Modifier</a>
<form method="post" style="margin:0"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="id" value="<?php echo $pid; ?>"><button class="btn btn--sm btn--ghost" type="submit" style="color:var(--danger)">Supprimer</button></form>
</div>
<?php endforeach; ?>
</div>
<h2 style="margin-top:32px"><?php echo $edition !== null ? "Modifier" : "Ajouter"; ?> un produit</h2>
<form method="post" style="margin-top:16px;max-width:640px">
<input type="hidden" name="action" value="enregistrer">
<input type="hidden" name="id" value="<?php echo ($ed["id"] ?? ""); ?>">
<div class="champ"><label for="f-nom">Nom</label><input id="f-nom" name="nom" type="text" value="<?php echo ($ed["nom"] ?? ""); ?>" required></div>
<div class="champ"><label for="f-categorie">Categorie</label>
<select id="f-categorie" name="categorie">
<?php $cats = ["Tees", "Hoodies", "Vestes", "Bas", "Accessoires"]; foreach ($cats as $c): ?>
<option value="<?php echo $c; ?>"<?php if (($ed["categorie"] ?? "") === $c) { echo " selected"; } ?>><?php echo $c; ?></option>
<?php endforeach; ?>
</select></div>
<div class="champ"><label for="f-prix">Prix (FCFA)</label><input id="f-prix" name="prix" type="number" value="<?php echo ($ed["prix"] ?? ""); ?>" required></div>
<div class="champ"><label for="f-ancien">Ancien prix</label><input id="f-ancien" name="ancienPrix" type="number" value="<?php echo ($ed["ancienPrix"] ?? ""); ?>"></div>
<div class="champ"><label for="f-couleurs">Couleurs (separees par des virgules)</label><input id="f-couleurs" name="couleurs" type="text" value="<?php echo implode(", ", $ed["couleurs"] ?? []); ?>"></div>
<div class="champ"><label for="f-tailles">Tailles (separees par des virgules)</label><input id="f-tailles" name="tailles" type="text" value="<?php echo implode(", ", $ed["tailles"] ?? []); ?>"></div>
<div class="champ"><label for="f-stock">Stock</label><input id="f-stock" name="stock" type="number" value="<?php echo ($ed["stock"] ?? 0); ?>"></div>
<div class="champ"><label for="f-description">Description</label><textarea id="f-description" name="description"><?php echo ($ed["description"] ?? ""); ?></textarea></div>
<div class="champ"><label><input name="nouveaute" type="checkbox" value="1"<?php if (!empty($ed["nouveaute"])) { echo " checked"; } ?>> Marquer comme nouveaute</label></div>
<button class="btn" type="submit">Enregistrer</button>
</form>
</main>
</body>
</html>
