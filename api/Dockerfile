FROM node:10.16.3-alpine

LABEL dev="Lippielip -> https://github.com/lippielip"
LABEL ops="Pitscher -> https://github.com/pitscher"
LABEL description = "The API of the Colloquium Selector Robot"
LABEL version ="0.1"

WORKDIR /usr/src/app

COPY package*.json ./

#RUN npm config set proxy http://proxy.tld:PORT
#RUN npm config set https-proxy https://proxy.tld:PORT

RUN npm install --production

COPY . .

EXPOSE 8000

ENV NODE_ENV="production"

CMD ["npm", "run", "start:prod"]