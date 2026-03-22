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

# Upload dir (local uploads). Railway: do NOT use Dockerfile VOLUME — add a Volume in the
# service settings and mount it at /data/uploads. See https://docs.railway.com/reference/volumes
RUN mkdir -p /data/uploads/interior-images

# Expose port (Railway sẽ tự động map port)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]

