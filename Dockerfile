# syntax=docker/dockerfile:1.4

FROM node:21-bullseye AS building

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install 

RUN npm run build

RUN rm -rf node_modules

# Final stage
FROM node:21-bullseye  AS final

LABEL mode="production"

WORKDIR /usr/src/app


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# RUN apt-get update && apt-get upgrade -y

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
    --no-install-recommends \
    && service dbus start \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV LOG_ENABLED true


COPY --from=building /usr/bin/dumb-init /usr/bin/dumb-init

# USER node

# COPY --from=build --chown=node:node /usr/src/app/node_modules node_modules
# COPY --from=build --chown=node:node /usr/src/app/dist dist

COPY --from=building /usr/src/app/dist /usr/src/app/dist/

COPY --from=building [\
    "/usr/src/app/package.json", \
    "/usr/src/app/package-lock.json", \
    "/usr/src/app/" \
    ]

RUN npm install --omit=dev

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT
# /usr/src/app/dist/src/main/http/server.js
HEALTHCHECK --interval=60s --timeout=12s --start-period=30s \
    CMD node healthcheck.js

CMD ["dumb-init", "node", "./dist/src/main/http/server.js"]