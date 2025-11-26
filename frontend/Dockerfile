FROM node:18-alpine

WORKDIR /app

# Copy everything needed for build
COPY package.json package-lock.json ./
COPY frontend ./frontend
COPY backend ./backend

# Install and build
RUN npm install && npm run build:frontend

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install serve to serve the static files
RUN npm install -g serve

# Copy built frontend
COPY --from=0 /app/frontend/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
