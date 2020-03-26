FROM node:alpine

WORKDIR /app

#COPY package.json ./

COPY . ./
RUN npm install --production

EXPOSE 3000

CMD ["node", "server.js"]