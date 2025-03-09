# Usa una imagen de Node.js
FROM node:18-alpine AS base
WORKDIR /app

# Instala dependencias solo si package.json cambia
COPY package.json package-lock.json ./
RUN npm install

# Copia todo el código
COPY . .

# Deshabilita caché en desarrollo
ENV NEXT_DEV=true
ENV WATCHPACK_POLLING=true

# Ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]
