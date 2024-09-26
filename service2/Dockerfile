# Dockerfile for Service2
FROM node:20.17.0

WORKDIR /service2
COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]
