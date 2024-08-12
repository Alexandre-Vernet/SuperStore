FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run lint

RUN npm run build:app


FROM nginx:alpine

COPY apps/superstore/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/apps/superstore /usr/share/nginx/html

EXPOSE 80
