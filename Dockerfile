FROM node:boron-alpine

MAINTAINER thefarang

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

RUN mkdir /app/bin
COPY ./bin/www /app/bin/www

RUN mkdir /app/src
COPY ./src /app/src

EXPOSE 80

CMD ["npm", "run", "debug"]
