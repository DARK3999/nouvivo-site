<?php
require_once __DIR__ . "/../includes/functions.php";
if (session_status() === PHP_SESSION_NONE) { session_start(); }
if (nv_admin_connecte()) { header("Location: index.php"); exit; }

$erreur = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $utilisateur = nv_nettoyer($_POST["utilisateur"] ?? "");
    $motdepasse = (string) ($_POST["motdepasse"] ?? "");
    $admin = nv_lire_json(NV_FICHIER_ADMIN, []);
    if (!empty($admin["utilisateur"]) && !empty($admin["hash"]) && hash_equals($admin["utilisateur"], $utilisateur) && password_verify($motdepasse, $admin["hash"])) {
        $_SESSION["nv_admin"] = ["utilisateur" => $utilisateur, "connexion" => time()];
        header("Location: index.php"); exit;
    }
    $erreur = "Identifiants incorrects.";
}
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Connexion — Administration NOUVIVO</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<main class="container" style="max-width:420px;padding-top:60px">
<a class="logo" href="../index.html"><img src="../assets/img/logo-nv.svg" alt="NOUVIVO" width="34" height="34"><span>NOUVIVO</span></a>
<h1 style="font-size:1.5rem;margin-top:20px">Espace admin</h1>
<?php if ($erreur): ?><div class="alerte alerte--err is-on"><?php echo $erreur; ?></div><?php endif; ?>
<form method="post" style="margin-top:16px">
<div class="champ"><label for="utilisateur">Identifiant</label><input id="utilisateur" name="utilisateur" type="text" required></div>
<div class="champ"><label for="motdepasse">Mot de passe</label><input id="motdepasse" name="motdepasse" type="password" required></div>
<button class="btn btn--bloc" type="submit">Se connecter</button>
</form>
<p class="muted" style="margin-top:16px;font-size:.8rem">Identifiants par défaut : daren / voir README.</p>
</main>
</body>
</html>
