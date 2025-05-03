# Step 1 : Build with Node 
FROM node:23-slim AS builder

WORKDIR /app

COPY src ./src
COPY static ./static
COPY .env ./
COPY package-lock.json ./
COPY package.json ./
COPY svelte.config.js ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Installing dependancies, building
RUN npm ci
RUN npm run build
RUN npm prune --production

# Step 2 : build a node app
FROM node:23-slim AS runner
    
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]

# HOW TO : 
    # docker build --pull --rm -f 'Dockerfile' -t 'timeline:latest' '.' 
    # docker run -d -p 3000:3000 timeline:latest
    # docker exec -it xxx /bin/ash