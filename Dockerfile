FROM node:24-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV PORT=9000
EXPOSE 9000

CMD ["pnpm", "start"]
