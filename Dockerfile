FROM node:19-alpine

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN yarn
RUN npm install 

COPY . .

EXPOSE 3001

CMD ["yarn", "start"]