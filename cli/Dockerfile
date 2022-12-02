FROM node:current-alpine

RUN mkdir /app
WORKDIR /app
RUN yarn add carbone

ADD app.js /app
ENTRYPOINT ["node", "./app.js"]
