# Dockerfile for Service2
FROM node:20.17.0

WORKDIR /service2

RUN apt-get update && apt-get install -y tini

COPY package.json .
RUN npm install

COPY . .

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/shared-entrypoint.sh", "npm", "start"]