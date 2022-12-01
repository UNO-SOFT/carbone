FROM node:current-alpine3.12

RUN mkdir /app
ADD app.js /app

WORKDIR /app
RUN yarn add busboy carbone
ENTRYPOINT node ./app.js

