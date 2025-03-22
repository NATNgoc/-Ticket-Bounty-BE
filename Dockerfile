FROM node:current-alpine3.21 as base
EXPOSE 3002
RUN mkdir -p /usr/src/app &&  chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:current-alpine3.21 as production
EXPOSE 3002
RUN mkdir -p /usr/src/app &&  chown -R node:node /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=base --chown=node:node /usr/src/app/package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY --from=base --chown=node:node /usr/src/app/dist ./dist
USER node
CMD ["node", "dist/src/main.js"]