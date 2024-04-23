# Utilisez une image officielle Python comme base
FROM python:3.11-alpine

# Définissez le répertoire de travail
WORKDIR /frontend

# Copiez les fichiers de l'application dans le répertoire de travail
COPY . .

# Installez les dépendances de l'application
RUN pip install --no-cache-dir -r requirements.txt

# Exposez le port sur lequel le serveur sera démarré
EXPOSE 8001

# Commande pour démarrer l'application
CMD ["python3", "-m", "http.server", "8001"]

