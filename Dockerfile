FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY . .

RUN mkdir -p /app/data && chown -R node:node /app/data

USER node

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/data

CMD ["node", "server.js"]
