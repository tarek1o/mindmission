FROM node:22.18-alpine

EXPOSE 8888

RUN mkdir  /app
WORKDIR /app

COPY  . .

RUN npm install \
 && npm run build