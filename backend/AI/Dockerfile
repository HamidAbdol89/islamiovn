# Dockerfile tối ưu cho Koyeb với tfjs-node
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# COPY package.json đúng path
COPY package*.json ./

# Install dependencies production
RUN npm install --only=production && npm cache clean --force

# Copy toàn bộ source code
COPY . .

# Tạo user non-root
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodejs

# Chown thư mục /app cho user non-root
RUN chown -R nodejs:nodejs /app
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Expose port
EXPOSE ${PORT:-8000}

# Start command
CMD ["node", "server.js"]
