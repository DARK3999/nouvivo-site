<?php
require_once __DIR__ . "/../includes/functions.php";
nv_exiger_admin();

$contacts = nv_lire_json(NV_FICHIER_CONTACTS, []);
$notice = "";

if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "supprimer") {
    $index = (int) ($_POST["index"] ?? -1);
    if (isset($contacts[$index])) {
        array_splice($contacts, $index, 1);
        nv_ecrire_json(NV_FICHIER_CONTACTS, $contacts);
        $notice = "Contact supprime.";
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Contacts — Administration NOUVIVO</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<main class="container" style="max-width:860px;padding-block:40px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<a class="logo" href="../index.html"><img src="../assets/img/logo-nv.svg" alt="NOUVIVO" width="34" height="34"><span>NOUVIVO</span></a>
<div><a class="btn btn--sm btn--ghost" href="index.php">Tableau de bord</a> <a class="btn btn--sm btn--ghost" href="logout.php">Deconnexion</a></div>
</div>
<h1 style="font-size:1.6rem;margin-top:24px">Contacts</h1>
<?php if ($notice): ?><div class="alerte alerte--ok is-on"><?php echo $notice; ?></div><?php endif; ?>
<?php if (count($contacts) === 0): ?>
<p class="muted" style="margin-top:16px">Aucun contact pour le moment.</p>
<?php else: ?>
<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
<?php foreach ($contacts as $i => $c): ?>
<?php $cd = $c["date"] ?? ""; $ce = $c["email"] ?? ""; $ct = $c["telephone"] ?? ""; ?>
<div style="display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--ligne);border-radius:var(--radius);padding:12px 16px">
<div style="flex:1"><strong><?php echo $ce; ?></strong> <span class="muted"><?php echo $ct; ?> · <?php echo $cd; ?></span></div>
<form method="post" style="margin:0"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="index" value="<?php echo $i; ?>"><button class="btn btn--sm btn--ghost" type="submit" style="color:var(--danger)">Supprimer</button></form>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>
</main>
</body>
</html>
