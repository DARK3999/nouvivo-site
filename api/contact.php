<?php
// NOUVIVO - traitement du formulaire de contact (anti-spam : honeypot + délai)
require_once __DIR__ . "/../includes/functions.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    nv_repondre_json(["ok" => false, "erreur" => "Méthode non autorisée"], 405);
}

if (nv_honeypot_actif()) {
    nv_repondre_json(["ok" => true]);
}

if (!nv_delai_valide("nv_contact", 3)) {
    nv_repondre_json(["ok" => false, "erreur" => "Envoi trop rapide, réessayez dans un instant"], 429);
}

$nom = nv_nettoyer($_POST["nom"] ?? "");
$email = nv_nettoyer($_POST["email"] ?? "");
$message = nv_nettoyer($_POST["message"] ?? "");

if ($nom === "" || $message === "" || !nv_email_valide($email)) {
    nv_repondre_json(["ok" => false, "erreur" => "Veuillez remplir correctement tous les champs"], 422);
}

if (strlen($message) > 5000) {
    nv_repondre_json(["ok" => false, "erreur" => "Message trop long"], 422);
}

$messages = nv_lire_json(NV_FICHIER_MESSAGES, []);
$messages[] = [
    "date" => date("c"),
    "nom" => $nom,
    "email" => $email,
    "message" => $message,
];

nv_ecrire_json(NV_FICHIER_MESSAGES, $messages);

nv_repondre_json(["ok" => true]);
