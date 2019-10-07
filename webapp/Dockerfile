# Part 1: Docker will build a PROD-ready version of the (React)WebApp
FROM node:10.16.3-alpine AS builder

WORKDIR /app
# Best practice: Copy package*.json first and then install
# If there is no change in these files we use Dockers cache
# Ergo: lightning fast build
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Part 2: Docker will build the Nginx image with the (React)WebApp
FROM nginx:1.16.1-alpine

LABEL dev="Lippielip -> https://github.com/lippielip"
LABEL ops="Pitscher -> https://github.com/pitscher"
LABEL description = "The WebApp/Frontend of the Colloquium Selector Robot"
LABEL version ="1.0"

COPY --from=builder /app/build/ /usr/share/nginx/html
COPY ./docker/nginx-http-error.html /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/vhost-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80