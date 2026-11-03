<?php
require_once __DIR__ . "/../includes/functions.php";
nv_exiger_admin();

$messages = nv_lire_json(NV_FICHIER_MESSAGES, []);
$notice = "";

if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "supprimer") {
    $index = (int) ($_POST["index"] ?? -1);
    if (isset($messages[$index])) {
        array_splice($messages, $index, 1);
        nv_ecrire_json(NV_FICHIER_MESSAGES, $messages);
        $notice = "Message supprime.";
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Messages — Administration NOUVIVÔ</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<main class="container" style="max-width:860px;padding-block:40px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<a class="logo" href="../index.html"><img src="../assets/img/logo-nv.svg" alt="NOUVIVÔ" width="34" height="34"><span>NOUVIVÔ</span></a>
<div><a class="btn btn--sm btn--ghost" href="index.php">Tableau de bord</a> <a class="btn btn--sm btn--ghost" href="logout.php">Deconnexion</a></div>
</div>
<h1 style="font-size:1.6rem;margin-top:24px">Messages</h1>
<?php if ($notice): ?><div class="alerte alerte--ok is-on"><?php echo $notice; ?></div><?php endif; ?>
<?php if (count($messages) === 0): ?>
<p class="muted" style="margin-top:16px">Aucun message pour le moment.</p>
<?php else: ?>
<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
<?php foreach ($messages as $i => $m): ?>
<?php $md = $m["date"] ?? ""; $mn = $m["nom"] ?? ""; $me = $m["email"] ?? ""; $mm = $m["message"] ?? ""; ?>
<div style="background:var(--surface);border:1px solid var(--ligne);border-radius:var(--radius);padding:16px">
<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><strong><?php echo $mn; ?></strong> <span class="muted"><?php echo $me; ?> · <?php echo $md; ?></span></div>
<p style="margin-top:8px;color:var(--blanc)"><?php echo nl2br($mm); ?></p>
<form method="post" style="margin-top:10px"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="index" value="<?php echo $i; ?>"><button class="btn btn--sm btn--ghost" type="submit" style="color:var(--danger)">Supprimer</button></form>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>
</main>
</body>
</html>
