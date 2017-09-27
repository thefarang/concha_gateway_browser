FROM node:8.5.0-alpine

RUN mkdir -p /app/bin /app/src /app/test
WORKDIR /app

COPY package.json npm-shrinkwrap.json /app/
RUN npm install --silent
RUN npm cache clean --force --silent

COPY ./bin/www /app/bin/www
COPY ./src /app/src
COPY ./test /app/test

EXPOSE 80
