FROM php:8.2-fpm
WORKDIR /var/www

RUN apt-get update && apt-get install -y libpq-dev unzip curl && \
    docker-php-ext-install pdo pdo_mysql

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --prefer-dist --optimize-autoloader
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
