FROM node:18-alpine3.17

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera hela projektet till arbetskatalogen i containern
COPY . /app

# Installera beroenden
RUN npm install

# Bygg applikationen
RUN npm run build

# Exponera porten som din applikations preview-kommando använder
EXPOSE 80

# Kör preview-kommando
CMD ["npm", "run", "preview"]
