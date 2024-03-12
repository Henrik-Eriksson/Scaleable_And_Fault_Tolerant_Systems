FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM ubuntu
RUN apt-get update && \
    apt-get install nginx -y && \
    echo "server { \n\
    listen 80; \n\
    \n\
    root /var/www/html; \n\
    index index.html; \n\
    \n\
    location / { \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /var/www/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
