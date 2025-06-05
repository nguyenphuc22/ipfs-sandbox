const { create } = require('ipfs-http-client');

class IPFSService {
    constructor() {
        this.client = null;
        this.initClient();
    }

    async initClient() {
        try {
            this.client = create({
                host: 'localhost',
                port: 5001,
                protocol: 'http',
                timeout: 10000  // 10s timeout
            });

            // Test connection
            await this.client.id();
            console.log('✅ Connected to IPFS');
        } catch (error) {
            console.error('❌ Failed to connect to IPFS:', error);
            // Retry after 5 seconds
            setTimeout(() => this.initClient(), 5000);
        }
    }

    async waitForConnection() {
        while (!this.client) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async addFile(buffer, options = {}) {
        try {
            const result = await this.client.add(buffer, {
                pin: true,
                ...options
            });
            return result;
        } catch (error) {
            console.error('IPFS add error:', error);
            throw error;
        }
    }

    async getFile(hash) {
        try {
            const chunks = [];
            for await (const chunk of this.client.cat(hash)) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('IPFS get error:', error);
            throw error;
        }
    }

    async pinFile(hash) {
        try {
            await this.client.pin.add(hash);
            return true;
        } catch (error) {
            console.error('IPFS pin error:', error);
            return false;
        }
    }

    async getNetworkInfo() {
        try {
            const id = await this.client.id();
            const peers = await this.client.swarm.peers();
            return {
                nodeId: id.id,
                addresses: id.addresses,
                peers: peers.length,
                agentVersion: id.agentVersion
            };
        } catch (error) {
            console.error('IPFS network info error:', error);
            throw error;
        }
    }
}

module.exports = new IPFSService();