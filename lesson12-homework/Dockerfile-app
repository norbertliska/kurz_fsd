FROM node:20-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat curl

COPY --chown=node:node package*.json ./
RUN npm i typescript --save-dev
RUN npm install -g nodemon
RUN npm ci 
COPY --chown=node:node /src ./src
COPY --chown=node:node nodemon.json ./
COPY --chown=node:node tsconfig.json ./

RUN npm run build

USER node
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "npm run start"]
