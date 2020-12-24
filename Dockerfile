FROM node:current-alpine3.12

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]