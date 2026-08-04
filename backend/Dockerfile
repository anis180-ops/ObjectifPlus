# Étape 1 : Choix de l'image de base Node.js en version Alpine pour alléger l'image
FROM node:16.20.2-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de l'application
RUN npm install --production

# Copie du reste du code source du backend
COPY . .

# Le backend expose le port interne 5000 configuré dans l'application
EXPOSE 5000

# Commande de démarrage du serveur backend
CMD ["npm", "start"]