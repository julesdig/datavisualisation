FROM php:8-apache

# Install additional PHP extensions
RUN docker-php-ext-install pdo pdo_mysql
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql

# Copy the code from the src folder on the host to the container
COPY . /var/www/html/
RUN chmod -R 777 /var/www/html
RUN a2enmod rewrite
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf
# Update Apache configuration to enable PHP


# Expose port 80 for Apache
EXPOSE 80
CMD ["apache2-foreground"]