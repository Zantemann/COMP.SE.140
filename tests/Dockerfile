FROM node:20.18.0

WORKDIR /tests

COPY . .

RUN npm install

ENV EXPOSED_URL=http://host.docker.internal:8197

CMD ["npm", "run", "test"]