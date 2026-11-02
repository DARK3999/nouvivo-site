<?php
require_once __DIR__ . "/../includes/functions.php";
if (session_status() === PHP_SESSION_NONE) { session_start(); }
unset($_SESSION["nv_admin"]);
session_destroy();
header("Location: login.php");
exit;
