FROM node:24.11-alpine

EXPOSE 8888

RUN mkdir  /app
WORKDIR /app

COPY  . .

RUN npm install \
 && npm run build