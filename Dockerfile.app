FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:app


FROM nginx:alpine

COPY --from=build /app/dist/apps/superstore /usr/share/nginx/html

EXPOSE 80
