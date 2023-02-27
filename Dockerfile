FROM node:latest

WORKDIR /app/

COPY ./ /app/

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]