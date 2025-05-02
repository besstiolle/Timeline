# Étape 1 : Build avec Node 
FROM node:23-slim AS builder

WORKDIR /app

# Copier les fichiers nécessaires au build
COPY src ./src
COPY static ./static
COPY .env ./
COPY package-lock.json ./
COPY package.json ./
COPY svelte.config.js ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Installer les dépendances
RUN npm ci
RUN npm run build
RUN npm prune --production

# Run step
FROM node:23-slim AS runner

WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]


# Étape 2 : With Nginx
#FROM nginx:alpine
#RUN rm -rf /usr/share/nginx/html/*
#COPY --from=builder /app/dist /usr/share/nginx/html
#COPY .svelte-kit/output/client /usr/share/nginx/html
#COPY .svelte-kit/output/server /usr/share/nginx/html
#EXPOSE 80

# see : https://sveltefr.dev/docs/kit/adapter-node


# HOW TO : 
    # docker build --pull --rm -f 'Dockerfile' -t 'timeline:latest' '.' 
    # docker run -d -p 8080:80 (ou 8080:3000) timeline:latest
    # docker exec -it xxx /bin/ash