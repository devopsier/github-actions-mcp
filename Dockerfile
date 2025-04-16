# Use a smaller base image for Node.js
FROM node:23-slim AS builder

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker's caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for the build)
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the project
RUN npm run build

# Use a minimal runtime image for production
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose port for HTTP server
EXPOSE 3000

# Start HTTP server by default
CMD ["node", "dist/stdio-server.js"]