FROM node:14.7-alpine

WORKDIR /code
COPY package.json package-lock.json ./tsconfig.json ./
RUN npm install

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

CMD [ "npm", "start" ]