FROM node:8.5.0-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY npm-shrinkwrap.json /app
RUN npm install

RUN mkdir /app/bin
COPY ./bin/www /app/bin/www

RUN mkdir /app/src
COPY ./src /app/src

RUN mkdir /app/test
COPY ./test /app/test

EXPOSE 80
