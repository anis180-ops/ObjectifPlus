# --- ÉTAPE 1 : Construction de l'application React ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Génération des fichiers statiques (HTML, CSS, JS) dans le dossier /app/build
RUN npm run build

# --- ÉTAPE 2 : Serveur de production Nginx ---
FROM nginx:alpine

# Suppression de la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie de votre fichier de configuration Nginx personnalisé (default.conf)
# Ce fichier contient les règles reverse proxy (proxy_pass) vers le backend
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers statiques générés à l'étape précédente vers le répertoire de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Nginx écoute sur le port 80 par défaut pour servir le frontend
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]