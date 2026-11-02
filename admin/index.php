<?php
require_once __DIR__ . "/../includes/functions.php";
nv_exiger_admin();

$produits = nv_lire_json(NV_FICHIER_PRODUITS, []);
$nb_produits = isset($produits["produits"]) ? count($produits["produits"]) : 0;
$messages = nv_lire_json(NV_FICHIER_MESSAGES, []);
$contacts = nv_lire_json(NV_FICHIER_CONTACTS, []);
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Tableau de bord — Administration NOUVIVO</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<main class="container" style="max-width:900px;padding-block:40px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<a class="logo" href="../index.html"><img src="../assets/img/logo-nv.svg" alt="NOUVIVO" width="34" height="34"><span>NOUVIVO</span></a>
<a class="btn btn--sm btn--ghost" href="logout.php">Se déconnecter</a>
</div>
<h1 style="font-size:1.6rem;margin-top:24px">Tableau de bord</h1>
<div class="valeurs" style="margin-top:20px">
<div class="valeur"><span>Produits</span><h3><?php echo $nb_produits; ?></h3><a class="btn btn--sm" href="produits.php">Gérer</a></div>
<div class="valeur"><span>Messages</span><h3><?php echo count($messages); ?></h3><a class="btn btn--sm" href="messages.php">Voir</a></div>
<div class="valeur"><span>Contacts</span><h3><?php echo count($contacts); ?></h3><a class="btn btn--sm" href="contacts.php">Voir</a></div>
</div>
<p class="muted" style="margin-top:24px">Modifiez vos produits depuis « Gérer » sans toucher au code.</p>
</main>
</body>
</html>
