# NOUVIVO — image PHP + Apache pour Render
# Sert les pages statiques ET le PHP (api/, admin/) en respectant .htaccess
FROM php:8.2-apache

# Modules Apache utilisés par .htaccess (rewrite, compression, cache, en-têtes)
RUN a2enmod rewrite deflate expires headers

# Autoriser les surcharges .htaccess dans la racine web
RUN printf '<Directory /var/www/html/>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n' > /etc/apache2/conf-available/nouvivo.conf \
    && a2enconf nouvivo

# Copier le site dans la racine Apache
COPY . /var/www/html/

# Le dossier data/ doit être accessible en écriture (messages contact, produits admin)
RUN chown -R www-data:www-data /var/www/html/data \
    && chmod -R 775 /var/www/html/data

# Render fournit $PORT ; Apache doit écouter dessus
ENV PORT=10000
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]
