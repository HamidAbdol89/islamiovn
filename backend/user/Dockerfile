FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
