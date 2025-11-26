FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies
RUN npm install

# Build both backend and frontend
RUN npm run build

WORKDIR /app/backend

EXPOSE 4000

CMD ["node", "dist/index.js"]
