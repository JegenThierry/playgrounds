FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node server.js ./

USER node

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "server.js"]
