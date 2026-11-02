<?php
// NOUVIVO - inscription à la liste de contacts
require_once __DIR__ . "/../includes/functions.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    nv_repondre_json(["ok" => false, "erreur" => "Méthode non autorisée"], 405);
}

if (nv_honeypot_actif()) {
    nv_repondre_json(["ok" => true]);
}

$email = nv_nettoyer($_POST["email"] ?? "");
$telephone = nv_nettoyer($_POST["telephone"] ?? "");

if (!nv_email_valide($email)) {
    nv_repondre_json(["ok" => false, "erreur" => "Adresse e-mail invalide"], 422);
}

$contacts = nv_lire_json(NV_FICHIER_CONTACTS, []);
$contacts[] = [
    "date" => date("c"),
    "email" => $email,
    "telephone" => $telephone,
];

nv_ecrire_json(NV_FICHIER_CONTACTS, $contacts);

nv_repondre_json(["ok" => true]);
