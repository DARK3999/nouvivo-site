<?php
// NOUVIVO - fonctions utilitaires : JSON, validation, sécurité

require_once __DIR__ . "/config.php";

function nv_lire_json($fichier, $defaut = []) {
    if (!file_exists($fichier)) { return $defaut; }
    $donnees = json_decode(file_get_contents($fichier), true);
    return is_array($donnees) ? $donnees : $defaut;
}

function nv_ecrire_json($fichier, $donnees) {
    $json = json_encode($donnees, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($fichier, $json, LOCK_EX) !== false;
}

function nv_nettoyer($valeur) {
    return trim(strip_tags((string) $valeur));
}

function nv_email_valide($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function nv_honeypot_actif() {
    return !empty($_POST["site"]);
}

function nv_delai_valide($cle, $secondes = 3) {
    if (session_status() === PHP_SESSION_NONE) { session_start(); }
    $maintenant = time();
    $ok = empty($_SESSION[$cle]) || ($maintenant - (int) $_SESSION[$cle]) >= $secondes;
    $_SESSION[$cle] = $maintenant;
    return $ok;
}

function nv_repondre_json($donnees, $code = 200) {
    http_response_code($code);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE);
    exit;
}

function nv_admin_connecte() {
    if (session_status() === PHP_SESSION_NONE) { session_start(); }
    if (empty($_SESSION["nv_admin"])) { return false; }
    return (time() - (int) $_SESSION["nv_admin"]["connexion"]) <= NV_SESSION_DUREE;
}

function nv_exiger_admin() {
    if (!nv_admin_connecte()) {
        header("Location: login.php");
        exit;
    }
}

function nv_liste($chaine) {
    $parts = array_map("trim", explode(",", (string) $chaine));
    return array_values(array_filter($parts, function ($v) { return $v !== ""; }));
}
