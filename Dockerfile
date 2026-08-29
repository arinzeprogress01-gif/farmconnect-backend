FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

EXPOSE 8080

CMD ["npm", "start"]