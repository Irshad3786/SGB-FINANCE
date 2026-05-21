# Use Node.js 20 Alpine for a lightweight production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Use 'npm ci' for clean, consistent production installs
# This is faster and more reliable than 'npm install'
RUN npm ci --omit=dev

# --- Production Stage ---
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create a non-privileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# Change ownership to non-privileged user
RUN chown -R appuser:appgroup /app

# Switch to non-privileged user
USER appuser

# Expose the backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]
