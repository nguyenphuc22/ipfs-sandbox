FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    bash \
    curl \
    jq \
    openssl \
    wget \
    tar \
    procps

# Install IPFS
RUN cd /tmp \
    && IPFS_VERSION=0.25.0 \
    && IPFS_DIST="kubo_v${IPFS_VERSION}_linux-amd64" \
    && wget "https://dist.ipfs.tech/kubo/v${IPFS_VERSION}/${IPFS_DIST}.tar.gz" \
    && tar -xvzf "${IPFS_DIST}.tar.gz" \
    && mv kubo/ipfs /usr/local/bin/ipfs \
    && rm -rf kubo "${IPFS_DIST}.tar.gz"

# Set up working directory
WORKDIR /ipfs-sandbox

# Copy all scripts
COPY scripts/ /ipfs-sandbox/scripts/

# Make scripts executable
RUN chmod +x /ipfs-sandbox/scripts/*.sh

# Entry point script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command
CMD ["/bin/bash"]