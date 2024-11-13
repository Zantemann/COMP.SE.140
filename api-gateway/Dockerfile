# Dockerfile for api-gateway
FROM node:20.17.0

WORKDIR /service2

COPY package.json .
RUN npm install

COPY . .

ENTRYPOINT ["/usr/local/bin/shared-entrypoint.sh", "npm", "start"]