# Build from the repository root: docker build -f apps/web/Dockerfile .
FROM node:24-alpine AS base
RUN npm install --global pnpm@11.25.0
WORKDIR /app

# Prune the monorepo down to what this app needs
FROM base AS prepare
RUN npm install --global turbo@2.11.7
COPY . .
RUN turbo prune my-react-router-app --docker

FROM base AS builder
# Install dependencies first, as they change less often than the source
COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo run build --filter=my-react-router-app
RUN pnpm --filter=my-react-router-app --prod --legacy deploy /prod

FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /prod/package.json ./
COPY --from=builder --chown=node:node /prod/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/web/build ./build
USER node
EXPOSE 3000
CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]
