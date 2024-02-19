# Välj Node.js som basimage
FROM node:latest

# Skapa och sätt arbetsmappen
WORKDIR /app

# Kopiera projektets filer till containern
COPY . /app

# Installera projektberoenden
RUN npm install

# Exponera porten som din Node.js-applikation använder
# Ersätt 'XXXX' med den faktiska porten som används av din applikation
EXPOSE 5174

# Starta utvecklingsservern för din Node.js-applikation
CMD ["npm", "run", "dev"]