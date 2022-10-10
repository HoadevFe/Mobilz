FROM node:14-alpine AS base

ARG BUILD_VERSION
ARG BUILD_TIME
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_TIME=$BUILD_TIME

COPY package.json yarn.lock ./
RUN yarn

FROM base AS dist

COPY . ./
COPY .env-sample ./.env
RUN yarn build
RUN yarn build-server

FROM node:14-alpine as node_modules

COPY package-server.json ./package.json
RUN yarn

FROM node:14-alpine as final

RUN addgroup -S mobilez && adduser -S mobilez -G mobilez
USER mobilez

RUN mkdir -p /home/mobilez/app

WORKDIR /home/mobilez/app

COPY --from=dist dist /home/mobilez/app/dist
COPY --from=dist server.js /home/mobilez/app/server.js
COPY --from=node_modules package.json /home/mobilez/app/package.json
COPY --from=node_modules node_modules /home/mobilez/app/node_modules

CMD yarn "start"
