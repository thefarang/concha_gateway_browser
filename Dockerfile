FROM node:boron-alpine

MAINTAINER thefarang

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 80

CMD ["npm", "run", "debug"]
