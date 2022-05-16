FROM node:16.4.2

WORKDIR /server

ENV PORT=4003

COPY package.json package-lock.json ./

COPY ./prisma prisma

RUN npm install && npm cache clean --force

RUN npm install -g nodemon

RUN npm run generate

RUN npm run deploy

COPY ./ ./

CMD ["npm", "run", "start"]