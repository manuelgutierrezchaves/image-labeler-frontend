FROM node:latest

WORKDIR /app/

COPY ./ /app/

EXPOSE 3000

RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "start" ]
