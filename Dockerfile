FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm ci \
  && npm run build -w packages/shared \
  && npm run build -w apps/api \
  && npm run build -w apps/web

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/packages/shared ./packages/shared

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
