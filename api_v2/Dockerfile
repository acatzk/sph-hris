FROM node:alpine

WORKDIR /usr/src/api_v2/

COPY package.json /usr/src/api_v2/
COPY package-lock.json /usr/src/api_v2/

RUN npm install

COPY . /usr/src/api_v2/

EXPOSE 3001

ENTRYPOINT ["npm", "run", "start:dev"]
