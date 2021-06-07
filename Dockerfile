FROM node
COPY . /j-coin-api
WORKDIR /j-coin-api
CMD node main.js
