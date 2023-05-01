FROM node:18.16.0-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY dist .

EXPOSE 8080

CMD ["yarn", "start"]