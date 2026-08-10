# --- build stage ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- serve stage ---
# The unprivileged image already listens on 8080 and runs as a non-root user.
FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
