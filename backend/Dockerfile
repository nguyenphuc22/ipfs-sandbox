FROM node:20-alpine

# Install IPFS - ARM64 version for M1
RUN apk add --no-cache wget tar
RUN wget https://dist.ipfs.tech/kubo/v0.24.0/kubo_v0.24.0_linux-arm64.tar.gz
RUN tar -xzf kubo_v0.24.0_linux-arm64.tar.gz
RUN mv kubo/ipfs /usr/local/bin/
RUN rm -rf kubo*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of source code
COPY . .

# Create IPFS data directory
RUN mkdir -p /data/ipfs

# Create database directory
RUN mkdir -p /app/data

# Expose ports
EXPOSE 3000 5001 8080

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]