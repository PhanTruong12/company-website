# Dockerfile cho Railway Deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app
ENV UPLOAD_ROOT=/data/uploads

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Fix: prevent uploaded images from being removed after deploy
# Persist uploads outside app source directory.
RUN mkdir -p /data/uploads/interior-images
VOLUME ["/data/uploads"]

# Expose port (Railway sẽ tự động map port)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]

