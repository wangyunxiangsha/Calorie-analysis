FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY prisma ./prisma
COPY src ./src
COPY tsconfig*.json nest-cli.json ./
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY tsconfig.seed.json ./
COPY scripts ./scripts
RUN mkdir -p /data/uploads/meals
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
