#!/usr/bin/env bash
# NOUVIVO — démarrage : fait écouter Apache sur le port fourni par Render ($PORT)
set -e

PORT="${PORT:-10000}"

# Apache écoute sur le port assigné par Render
sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

exec "$@"
