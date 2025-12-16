# Multi-stage build for React/Vite application

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
# These must be provided during docker build using --build-arg
ARG VITE_HOSTAWAY_CLIENT_ID
ARG VITE_HOSTAWAY_CLIENT_SECRET
ARG VITE_HOSTAWAY_TOKEN_URL=https://api.hostaway.com/v1/accessTokens
ARG VITE_HOSTAWAY_BASE_URL=https://api.hostaway.com/v1

# Validate that required build arguments are provided
RUN if [ -z "$VITE_HOSTAWAY_CLIENT_ID" ] || [ -z "$VITE_HOSTAWAY_CLIENT_SECRET" ]; then \
    echo "ERROR: VITE_HOSTAWAY_CLIENT_ID and VITE_HOSTAWAY_CLIENT_SECRET must be provided as build arguments" && \
    echo "Usage: docker build --build-arg VITE_HOSTAWAY_CLIENT_ID=xxx --build-arg VITE_HOSTAWAY_CLIENT_SECRET=yyy -t image:tag ." && \
    exit 1; \
    fi

# Set environment variables for build (Vite requires these at build time)
# Use ARG values directly in ENV to ensure they're available during build
ENV VITE_HOSTAWAY_CLIENT_ID=$VITE_HOSTAWAY_CLIENT_ID
ENV VITE_HOSTAWAY_CLIENT_SECRET=$VITE_HOSTAWAY_CLIENT_SECRET
ENV VITE_HOSTAWAY_TOKEN_URL=$VITE_HOSTAWAY_TOKEN_URL
ENV VITE_HOSTAWAY_BASE_URL=$VITE_HOSTAWAY_BASE_URL

# Verify environment variables are set (for debugging)
RUN echo "Building with VITE_HOSTAWAY_CLIENT_ID: ${VITE_HOSTAWAY_CLIENT_ID:0:5}..." && \
    echo "Building with VITE_HOSTAWAY_CLIENT_SECRET: ${VITE_HOSTAWAY_CLIENT_SECRET:+SET}" && \
    echo "Building with VITE_HOSTAWAY_TOKEN_URL: $VITE_HOSTAWAY_TOKEN_URL"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application (environment variables are baked into the build)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

