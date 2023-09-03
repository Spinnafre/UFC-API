# syntax=docker/dockerfile:1.4

FROM node:18-bullseye-slim AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

COPY package*.json ./

COPY . /usr/src/app

# RUN npm run build

# RUN rm -rf node_modules

RUN npm ci --only=production

# Final stage
FROM node:18-bullseye-slim AS final

LABEL mode="production"

WORKDIR /usr/src/app


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

USER node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

COPY --from=build --chown=node:node /usr/src/app/node_modules node_modules
# COPY --from=build --chown=node:node /usr/src/app/dist dist
COPY --chown=node:node . /usr/src/app

HEALTHCHECK --interval=30s --timeout=12s --start-period=30s \
    CMD node healthcheck.js

CMD node src/main/http/server.ts