FROM node:16.4.2

WORKDIR /server

ENV PORT=4003

COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm install && npm cache clean --force

COPY ./prisma prisma

RUN npm install -g nodemon

RUN npm run generate

COPY ./ ./

CMD ["npm", "run", "start"]