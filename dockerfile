# Skapa och sätt arbetsmappen
WORKDIR /app

# Kopiera projektets filer till containern
COPY ./dist/ /app

EXPOSE 80