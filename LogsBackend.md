phucnguyen@Phucs-MacBook-Pro ipfs-sandbox % ./clean-docker.sh && ./start-system.sh
🧹 Starting Docker Cleanup for IPFS ID-RS Project...

📦 Stopping project containers...
🗑️  Removing project containers...
ℹ️  No project containers found
💾 Removing project volumes...
ℹ️  No project volumes found
🗃️  Removing local backend persisted data...
✅ Local backend data directory reset
🖼️  Removing project images...
Untagged: ipfs-sandbox-gateway:latest
Deleted: sha256:aba38952640f352dab7047b3e15e9f2c7fb9d65c084805587438fc935673b698
✅ Images removed
🧽 Cleaning unused Docker resources...
Total reclaimed space: 0B
Total reclaimed space: 0B
Total reclaimed space: 0B
🏗️  Clean Docker build cache? (y/N)
y
ID                                              RECLAIMABLE     SIZE            LAST ACCESSED
thsjw6sushals9i8h3zkbh8lb*                      true            236.6MB         24 minutes ago
xixlxiwwiyu2urd3g3xqbkjdh                       true    18.96kB         24 minutes ago
s7cd6jg7517lfxdd9a4acrhlb*                      true    8.192kB         24 minutes ago
rz9lxm3xxmq4tk04w3k6eiovc*                      true    4.096kB         24 minutes ago

nn1ouq9mx6qe2v7f9a4y6k8c8                       true    14.87kB         24 minutes ago
s6q6yo0121uxvsuijqh821oxg                       true    8.224kB         24 minutes ago
r8i55xakr18iu5670tb298h6a                       true    16.5kB          24 minutes ago
2c79n3x4ssr425oaofng49eox                       true    301.7MB         24 minutes ago
zowqz7j5zc3ze7qj1o2w33f8f                       true    49.52MB         24 minutes ago
ngy7w6om3wk12beu6yak7l71x                       true    594.5kB         24 minutes ago
juokqdtuuzqun41hyy7vuol9o                       true    278.8MB         24 minutes ago
lewqxl731uu88njvpddghg346                       true    322.9kB         24 minutes ago
rh0gijhuug35zxtx55vo8a0ml                       true    8.283kB         24 minutes ago
lyq8svasg13adiijld8etqiql                       true    8.309kB         24 minutes ago
2leaaaxbyre9ycql2zoey69e9                       true    97.28MB         24 minutes ago
bb27t4c940nbz3u6plqy0nqlt                       true    97.28MB         24 minutes ago
qse814h86fhrm1rfgtrst5gug                       true    59.92MB         24 minutes ago
s82a5robegz8ap2l8s8pnfh3g                       true    15.34MB         24 minutes ago
9kuot3barw3d0feslny1oql3q                       true    20.93kB         24 minutes ago
xmd5pa91ijqg4imn4kj0rlbuh                       true    9.032MB         27 minutes ago
6ac2v86sp3tioxt2fhsibli6z                       true    165.8MB         27 minutes ago
5b9vrbpwq2v2y3iamm4w2dcak                       true    72.94kB         27 minutes ago
x4fc8jzkookqb7nuxkf26us03                       true    135.8MB         27 minutes ago
Total:  1.448GB

✅ Cleanup completed!
📊 Current Docker disk usage:
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         0         74.11MB   74.11MB (100%)
Containers      0         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B

⚠️  Run full system prune? This will remove ALL unused Docker data (y/N)

🎉 Docker cleanup finished!
💡 To restart the system, run: ./start-system.sh
🚀 Starting IPFS ID-RS System...


🏗️  Building Docker images...
[+] Building 234.8s (22/22) FINISHED                                                          docker:desktop-linux
=> [gateway internal] load build definition from Dockerfile                                                  0.1s
=> => transferring dockerfile: 1.11kB                                                                        0.0s
=> [gateway internal] load metadata for docker.io/library/node:20-slim                                      73.0s
=> [gateway internal] load .dockerignore                                                                     0.0s
=> => transferring context: 164B                                                                             0.0s
=> [gateway  1/16] FROM docker.io/library/node:20-slim@sha256:126743e567aed4b039b1f5816467f790376f52d3f766  49.7s  => => resolve docker.io/library/node:20-slim@sha256:126743e567aed4b039b1f5816467f790376f52d3f7667cddc173b8a  0.0s
=> => sha256:eea41e5ad76711e72e5e4cc69d7ba58b49cb2b715fe7c73a139d482c9b534984 447B / 447B                    1.7s
=> => sha256:79d6b4c72e5ef93f32d1d7cc2f968462e9e20d3f1f0987eef7c34d8f9982960e 1.71MB / 1.71MB                2.4s  => => sha256:159d6f22ab46a9c51bdb102f1cd022664a852a40dcc8a8d8f2492029d11576e0 40.89MB / 40.94MB            161.5s
=> => sha256:8085e622db5efa543b3ee5ee07e1f744f529c49b9345097429c9e2ef8be93ba2 3.31kB / 3.31kB                1.6s
=> => sha256:21b7accdc53fc02b56a5c1cccd412be04189e5a5e674fd092ffbedc72596be91 28.10MB / 28.10MB              9.6s
=> => extracting sha256:21b7accdc53fc02b56a5c1cccd412be04189e5a5e674fd092ffbedc72596be91                     2.6s
=> => extracting sha256:8085e622db5efa543b3ee5ee07e1f744f529c49b9345097429c9e2ef8be93ba2                     0.0s
=> => extracting sha256:159d6f22ab46a9c51bdb102f1cd022664a852a40dcc8a8d8f2492029d11576e0                     1.0s
=> => extracting sha256:79d6b4c72e5ef93f32d1d7cc2f968462e9e20d3f1f0987eef7c34d8f9982960e                     0.0s
=> => extracting sha256:eea41e5ad76711e72e5e4cc69d7ba58b49cb2b715fe7c73a139d482c9b534984                     0.0s
=> [gateway internal] load build context                                                                    12.0s
=> => transferring context: 195.63MB                                                                        12.0s
=> [gateway  2/16] RUN apt-get update && apt-get install -y     wget     tar     openssl     ca-certificate  7.8s
=> [gateway  3/16] RUN wget https://dist.ipfs.tech/kubo/v0.24.0/kubo_v0.24.0_linux-arm64.tar.gz             15.6s  => [gateway  4/16] RUN tar -xzf kubo_v0.24.0_linux-arm64.tar.gz                                              0.8s
=> [gateway  5/16] RUN mv kubo/ipfs /usr/local/bin/                                                          0.5s
=> [gateway  6/16] RUN rm -rf kubo*                                                                          0.2s  => [gateway  7/16] WORKDIR /app                                                                              0.0s
=> [gateway  8/16] COPY package*.json ./                                                                     0.1s
=> [gateway  9/16] RUN npm ci                                                                               39.9s
=> [gateway 10/16] COPY prisma ./prisma                                                                      0.4s
=> [gateway 11/16] COPY generated ./generated                                                                1.5s
=> [gateway 12/16] COPY . .                                                                                 16.0s
=> [gateway 13/16] RUN mkdir -p /data/ipfs                                                                   0.7s
=> [gateway 14/16] RUN mkdir -p /app/data                                                                    0.4s
=> [gateway 15/16] COPY start.sh /start.sh                                                                   0.0s
=> [gateway 16/16] RUN chmod +x /start.sh                                                                    0.2s
=> [gateway] exporting to image                                                                             27.2s
=> => exporting layers                                                                                      13.4s
=> => exporting manifest sha256:5857057fffa61638b9ee98b70c5c02db58fceb7bdf61fd5923022f0755de54a2             0.0s
=> => exporting config sha256:0d2462a4804fedd19404babef3c96046ad985894c986e45440a7428ef763f436               0.0s
=> => exporting attestation manifest sha256:260020ab5060726c766a3a464b980340689f5ea30e187d32fd7796c9cef3bdc  0.0s
=> => exporting manifest list sha256:0547b3486479b7843bb145b5fa83fd9c529d591ae25f69a8570d7ea770f2668e        0.0s
=> => naming to docker.io/library/ipfs-sandbox-gateway:latest                                                0.0s
=> => unpacking to docker.io/library/ipfs-sandbox-gateway:latest                                            13.5s  => [gateway] resolving provenance for metadata file                                                          0.0s
[+] Building 1/1
✔ gateway  Built                                                                                             0.0s
🐳 Starting containers...
[+] Running 9/9
✔ Network ipfs-sandbox_ipfs-private     Created                                                              0.1s
✔ Volume "ipfs-sandbox_node2_data"      Created                                                              0.0s
✔ Volume "ipfs-sandbox_node3_data"      Created                                                              0.0s
✔ Volume "ipfs-sandbox_gateway_data"    Created                                                              0.0s
✔ Volume "ipfs-sandbox_node1_data"      Created                                                              0.0s
✔ Container ipfs-sandbox-gateway-1      Started                                                             14.9s
✔ Container ipfs-sandbox-ipfs-node-3-1  Started                                                             14.8s
✔ Container ipfs-sandbox-ipfs-node-2-1  Started                                                             14.8s
✔ Container ipfs-sandbox-ipfs-node-1-1  Started                                                             14.9s
⏳ Waiting for services to start...
⏳ Checking IPFS storage nodes status...                                                                           ⏳ IPFS Node 1 is starting...
⏳ IPFS Node 2 is starting...
⏳ IPFS Node 3 is starting...
⏳ Waiting for Backend API on port 3000...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...                                                            ⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...                                                            ⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
⏳ Backend API port open but HTTP not ready [000000]...
✅ Backend API is ready on port 3000 [HTTP 200]
⏳ Waiting for IPFS API on port 5001...
✅ IPFS API is ready on port 5001 [HTTP 200]
⏳ Waiting for IPFS Gateway on port 8080...
✅ IPFS Gateway is ready on port 8080 [HTTP 404]

📦 Container Status:                                                                                               NAME                         IMAGE                  COMMAND                   SERVICE       CREATED          STATUS                             PORTS
ipfs-sandbox-gateway-1       ipfs-sandbox-gateway   "docker-entrypoint.s…"    gateway       54 seconds ago   Up 38 seconds (health: starting)   0.0.0.0:3000->3000/tcp, 0.0.0.0:5001->5001/tcp, 0.0.0.0:8080->8080/tcp
ipfs-sandbox-ipfs-node-1-1   ipfs/go-ipfs:v0.24.0   "sh -c '\n  # Ensure …"   ipfs-node-1   54 seconds ago   Up 38 seconds (healthy)            4001/tcp, 5001/tcp, 8080-8081/tcp, 4001/udp
ipfs-sandbox-ipfs-node-2-1   ipfs/go-ipfs:v0.24.0   "sh -c '\n  # Ensure …"   ipfs-node-2   54 seconds ago   Up 38 seconds (healthy)            4001/tcp, 5001/tcp, 8080-8081/tcp, 4001/udp
ipfs-sandbox-ipfs-node-3-1   ipfs/go-ipfs:v0.24.0   "sh -c '\n  # Ensure …"   ipfs-node-3   54 seconds ago   Up 38 seconds (healthy)            4001/tcp, 5001/tcp, 8080-8081/tcp, 4001/udp

🔗 Verifying IPFS network connectivity...
✅ Gateway connected to 6 peers
✅ Node 1 connected to 6 peers
✅ Node 2 connected to 6 peers
✅ Node 3 connected to 6 peers
✅ IPFS network is connected (total: 18 connections)

🧪 Testing Backend API...
✅ Backend API is healthy

🔍 Testing API endpoints...
✅ /api/users is responding
⚠️  /api/auth returned unexpected response
⚠️  /api/files returned unexpected response
⚠️  /api/signatures returned unexpected response

🌐 System URLs:
Backend API:       http://localhost:3000
Health Check:      http://localhost:3000/health
IPFS API:          http://localhost:5001
IPFS Gateway:      http://localhost:8080

📋 Quick Commands:
View logs:         docker compose logs -f
View gateway logs: docker compose logs -f gateway
Check IPFS peers:  docker exec ipfs-sandbox-gateway-1 ipfs swarm peers
Test APIs:         curl http://localhost:3000/api/users
Stop system:       docker compose down
Clean system:      ./clean-docker.sh

🎉 System started successfully!

📜 Show logs? (y/N)
y
gateway-1      | IPFS_PATH set to: /data/ipfs
ipfs-node-3-1  | generating ED25519 keypair...done
ipfs-node-3-1  | peer identity: 12D3KooWKC3Pd6i5AS95ou2kozcfqVco3qA7b3VvwWMveZbF2f4L
ipfs-node-3-1  | initializing IPFS node at /data/ipfs
ipfs-node-3-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
ipfs-node-3-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
ipfs-node-3-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
ipfs-node-3-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
ipfs-node-2-1  | generating ED25519 keypair...done
ipfs-node-2-1  | peer identity: 12D3KooWGBhcze4QGAg3ukoHs7FS6s6UZMNG5YPWHD2F7215y95r
ipfs-node-2-1  | initializing IPFS node at /data/ipfs
ipfs-node-3-1  | removed /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
ipfs-node-3-1  | removed /ip4/104.131.131.82/udp/4001/quic-v1/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
ipfs-node-1-1  | generating ED25519 keypair...done
ipfs-node-2-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
ipfs-node-2-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
ipfs-node-1-1  | peer identity: 12D3KooWSGvrAtvnQpYFVSUjAt3juv7DFagxnUM1cn3MbQ2xHgNp
ipfs-node-1-1  | initializing IPFS node at /data/ipfs
ipfs-node-2-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
ipfs-node-2-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
ipfs-node-2-1  | removed /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
ipfs-node-2-1  | removed /ip4/104.131.131.82/udp/4001/quic-v1/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
ipfs-node-2-1  | Initializing daemon...
ipfs-node-2-1  | Kubo version: 0.24.0-e70db65
ipfs-node-2-1  | Repo version: 15
ipfs-node-2-1  | System version: arm64/linux
ipfs-node-2-1  | Golang version: go1.21.4
gateway-1      | /usr/local/bin/ipfs
ipfs-node-3-1  | Initializing daemon...
ipfs-node-3-1  | Kubo version: 0.24.0-e70db65
gateway-1      | ipfs version 0.24.0
ipfs-node-3-1  | Repo version: 15
ipfs-node-3-1  | System version: arm64/linux
ipfs-node-3-1  | Golang version: go1.21.4
ipfs-node-2-1  | Swarm is limited to private network of peers with the swarm key
ipfs-node-2-1  | Swarm key fingerprint: c1df9ee7cb3c82fb83c6935ec7009ad7
ipfs-node-3-1  | Swarm is limited to private network of peers with the swarm key
ipfs-node-3-1  | Swarm key fingerprint: c1df9ee7cb3c82fb83c6935ec7009ad7
ipfs-node-3-1  | Swarm listening on /ip4/127.0.0.1/tcp/4001
ipfs-node-3-1  | Swarm listening on /ip4/172.18.0.4/tcp/4001
ipfs-node-3-1  | Swarm listening on /p2p-circuit
ipfs-node-3-1  | Swarm announcing /ip4/127.0.0.1/tcp/4001
ipfs-node-3-1  | Swarm announcing /ip4/172.18.0.4/tcp/4001
ipfs-node-3-1  | RPC API server listening on /ip4/127.0.0.1/tcp/5001
ipfs-node-1-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
ipfs-node-1-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
ipfs-node-2-1  | Swarm listening on /ip4/127.0.0.1/tcp/4001
ipfs-node-2-1  | Swarm listening on /ip4/172.18.0.5/tcp/4001
ipfs-node-2-1  | Swarm listening on /p2p-circuit
ipfs-node-2-1  | Swarm announcing /ip4/127.0.0.1/tcp/4001
gateway-1      | Cleaning up IPFS locks...
ipfs-node-3-1  | WebUI: http://127.0.0.1:5001/webui
ipfs-node-3-1  | Gateway server listening on /ip4/127.0.0.1/tcp/8080
ipfs-node-3-1  | Daemon is ready
ipfs-node-1-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
ipfs-node-1-1  | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
ipfs-node-1-1  | removed /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
ipfs-node-1-1  | removed /ip4/104.131.131.82/udp/4001/quic-v1/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
gateway-1      | Initializing IPFS...
gateway-1      | generating ED25519 keypair...done
gateway-1      | peer identity: 12D3KooWKRuPqUBJ9bG6FQHMAMMYJVAbFTSsauc9uvpf6sqcHiNg
ipfs-node-1-1  | Initializing daemon...
ipfs-node-1-1  | Kubo version: 0.24.0-e70db65
gateway-1      | initializing IPFS node at /data/ipfs
ipfs-node-2-1  | Swarm announcing /ip4/172.18.0.5/tcp/4001
ipfs-node-2-1  | RPC API server listening on /ip4/127.0.0.1/tcp/5001
ipfs-node-2-1  | WebUI: http://127.0.0.1:5001/webui
ipfs-node-2-1  | Gateway server listening on /ip4/127.0.0.1/tcp/8080
ipfs-node-2-1  | Daemon is ready
ipfs-node-1-1  | Repo version: 15
ipfs-node-1-1  | System version: arm64/linux
ipfs-node-1-1  | Golang version: go1.21.4
ipfs-node-1-1  | Swarm is limited to private network of peers with the swarm key
ipfs-node-1-1  | Swarm key fingerprint: c1df9ee7cb3c82fb83c6935ec7009ad7
ipfs-node-1-1  | Swarm listening on /ip4/127.0.0.1/tcp/4001
ipfs-node-1-1  | Swarm listening on /ip4/172.18.0.3/tcp/4001
ipfs-node-1-1  | Swarm listening on /p2p-circuit
ipfs-node-1-1  | Swarm announcing /ip4/127.0.0.1/tcp/4001
ipfs-node-1-1  | Swarm announcing /ip4/172.18.0.3/tcp/4001
ipfs-node-1-1  | RPC API server listening on /ip4/127.0.0.1/tcp/5001
ipfs-node-1-1  | WebUI: http://127.0.0.1:5001/webui
ipfs-node-1-1  | Gateway server listening on /ip4/127.0.0.1/tcp/8080
ipfs-node-1-1  | Daemon is ready
gateway-1      | Swarm key already exists
gateway-1      | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
gateway-1      | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
gateway-1      | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
gateway-1      | removed /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
gateway-1      | removed /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
gateway-1      | removed /ip4/104.131.131.82/udp/4001/quic-v1/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
gateway-1      | Waiting for storage nodes to initialize...
gateway-1      | Cleaning up IPFS locks...
gateway-1      | Cleaning up IPFS locks...
gateway-1      | Starting IPFS daemon with IPFS_PATH=/data/ipfs...
gateway-1      | IPFS daemon started with PID: 128
gateway-1      | Daemon output will be logged to /tmp/ipfs-daemon.log
gateway-1      | Waiting for IPFS daemon to start (IPFS_PATH=/data/ipfs)...
gateway-1      | ✅ IPFS daemon is ready!
gateway-1      | 12D3KooWKRuPqUBJ9bG6...
gateway-1      | Discovering and connecting to storage nodes...
gateway-1      | 🔍 Discovering ipfs-node-1...
gateway-1      | 📍 Found ipfs-node-1 at IP: 172.18.0.3
gateway-1      | ⚠️  Connection attempt 1 failed, retrying...
gateway-1      | ⚠️  Connection attempt 2 failed, retrying...
gateway-1      | ❌ Failed to connect to ipfs-node-1 after 3 attempts
gateway-1      | 🔍 Discovering ipfs-node-2...
gateway-1      | 📍 Found ipfs-node-2 at IP: 172.18.0.5
gateway-1      | ⚠️  Connection attempt 1 failed, retrying...
gateway-1      | ⚠️  Connection attempt 2 failed, retrying...
gateway-1      | ❌ Failed to connect to ipfs-node-2 after 3 attempts
gateway-1      | 🔍 Discovering ipfs-node-3...
gateway-1      | 📍 Found ipfs-node-3 at IP: 172.18.0.4
gateway-1      | ⚠️  Connection attempt 1 failed, retrying...
gateway-1      | ⚠️  Connection attempt 2 failed, retrying...
gateway-1      | ❌ Failed to connect to ipfs-node-3 after 3 attempts
gateway-1      |
gateway-1      | 📊 Current swarm network status:
gateway-1      | Connected peers: 6
gateway-1      | Peer addresses:
gateway-1      | /ip4/172.18.0.3/tcp/4001/p2p/12D3KooWSGvrAtvnQpYFVSUjAt3juv7DFagxnUM1cn3MbQ2xHgNp
gateway-1      | /ip4/172.18.0.3/tcp/45316/p2p/12D3KooWSGvrAtvnQpYFVSUjAt3juv7DFagxnUM1cn3MbQ2xHgNp
gateway-1      | /ip4/172.18.0.4/tcp/4001/p2p/12D3KooWKC3Pd6i5AS95ou2kozcfqVco3qA7b3VvwWMveZbF2f4L
gateway-1      | Validating IPFS HTTP endpoints...
gateway-1      | WARNING: IPFS API endpoint not responding
gateway-1      | WARNING: IPFS HTTP endpoints not fully functional, continuing anyway...
gateway-1      | ⚠️  Skipping Prisma migrations during startup
gateway-1      | 💡 Run migrations manually: docker exec ipfs-sandbox-gateway-1 npx prisma migrate deploy
gateway-1      | Starting Node.js application...
gateway-1      |
gateway-1      | > ipfs-idrs-gateway@1.0.0 start
gateway-1      | > node src/server.js
gateway-1      |
gateway-1      | [DatabaseInit] Initialized database from template: /app/data/database.db
gateway-1      | 🚀 Gateway server running on port 3000
gateway-1      | 📁 IPFS API: http://localhost:5001
gateway-1      | 🌐 IPFS Gateway: http://localhost:8080
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:21 +0000] "GET /health HTTP/1.1" 200 90 "-" "curl/8.7.1"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:40 +0000] "GET /health HTTP/1.1" 200 90 "-" "curl/8.7.1"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:40 +0000] "GET /api/users HTTP/1.1" 200 43 "-" "curl/8.7.1"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:40 +0000] "GET /api/auth HTTP/1.1" 200 120 "-" "curl/8.7.1"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:40 +0000] "GET /api/files HTTP/1.1" 404 27 "-" "curl/8.7.1"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:10:40 +0000] "GET /api/signatures HTTP/1.1" 200 417 "-" "curl/8.7.1"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:10:47 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:11:17 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:11:47 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:12:17 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:12:48 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:13:18 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:13:48 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:14:18 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:14:48 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:15:19 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:15:49 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:16:19 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:16:49 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:17:19 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:17:50 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:18:20 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:18:50 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:19:20 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:19:50 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:20:20 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:20:50 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:21:20 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:21:50 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:22:21 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:22:51 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:23:21 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:23:51 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:24:21 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:24:51 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:25:21 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:25:51 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:26:22 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:26:52 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:09 +0000] "POST /api/auth/register HTTP/1.1" 201 1894 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:10 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:10 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:11 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:11 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:11 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:11 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:11 +0000] "GET /api/auth/context HTTP/1.1" 200 1682 "-" "okhttp/4.9.2"
gateway-1      | prisma:info Starting a sqlite pool with 17 connections.
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Fetched 6 public keys for ring
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 6,
gateway-1      |   providedCount: 6,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 6,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 6,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: 'ad9f5b05307c0a0b7a0b...', s: 'a7c5c27df9f679997709...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '036b7a6c6e633287ea65',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03f60363f8548aaf358d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: d5e1b384273d07827a12...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: 'd5e1b384273d07827a12...', s: '232896efe03090f9d953...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0254266de87794999daf',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03e0cfe2dcc586214c28'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: 6fe43e018e988c41429d...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: '6fe43e018e988c41429d...', s: 'f43ea675c9b6e0c94c47...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0347ad4f7b8f0bf31d73',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03a1483d6660f2047d10'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 6ab9f3629a85f0597379...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '6ab9f3629a85f0597379...', s: '7603712baf2c2d94e4e4...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0277fc08cd78d3433ff0',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02cb2bc92965232cb76b'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: 7c63ab70c4e937840a5e...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: '7c63ab70c4e937840a5e...', s: '4902e6cb9ea874c19939...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02a2ebbbde23e7330bdd',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0311c829e5a14fe2f3cc'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: e2dfd268d200cc6dbc12...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: 'e2dfd268d200cc6dbc12...', s: 'fb6b78dcd240c2ac611d...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '035f3e5a654d4e2dce78',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02472bbf0fe9636727c2'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: ad9f5b05307c0a0b7a0b...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: 'ad9f5b05307c0a0b7a0b90edb1c455d09258e574340542dc58a8cea29444e8b0',
gateway-1      |   initialC: 'ad9f5b05307c0a0b7a0b90edb1c455d09258e574340542dc58a8cea29444e8b0',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 029193e22581e61d...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE (`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`status` IN (?,?) AND (`main`.`AnonymousFileAccess`.`status` = ? OR `main`.`AnonymousFileAccess`.`expiresAt` IS NULL OR `main`.`AnonymousFileAccess`.`expiresAt` >= ?)) ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:27:13.822Z] [INFO] [FileAccessService] Listed 0 files for publicKeyHash: b0175146c9589507...
gateway-1      | [2025-10-22T05:27:13.822Z] [INFO] [AnonymousList] Listed 0 active / 0 revoked files for publicKeyHash: b0175146c9589507... [437ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:13 +0000] "POST /api/files/anonymous-list HTTP/1.1" 200 178 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:23 +0000] "POST /api/auth/register HTTP/1.1" 201 2168 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:27:23 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:24 +0000] "GET /api/files/test-ipfs HTTP/1.1" 200 155 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:25 +0000] "GET /api/auth/context HTTP/1.1" 200 1956 "-" "okhttp/4.9.2"
gateway-1      | prisma:query SELECT 1
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '2649e1be003aa65bc3b5...', s: '88d62d0c6fe4fd952975...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '037cd91a21771cd688b7',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '023a38cd3102a83311cf'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 1f9e2b259292fa057a24...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '1f9e2b259292fa057a24...', s: 'ba459aeacd3e412898e8...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03b7062bb0809950733c',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02368bfbbdad717ed8d8'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: a885bdd77cb2d53b2c25...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'a885bdd77cb2d53b2c25...', s: '66c64de068861d48fc9a...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '030ed2278598a3cc4e43',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '036edd9be83fb0bf344f'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 2065704295ee287bc147...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '2065704295ee287bc147...', s: '541cffbcc989c662c9e5...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02ac14819a1d20c62737',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '021946235cd68d9ecffe'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: aeb117fbbf269287229c...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'aeb117fbbf269287229c...', s: '9a510b1974c4849d963e...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '033fe7de6d56f52dd1d8',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '033589642f3cc37f5316'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 3d4cc6f98a8d3b6f472f...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '3d4cc6f98a8d3b6f472f...', s: '9891e2e1a3fe2de206d9...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0277400244d8a0f7e6c2',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '025a077704dcee6975b0'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: c54b7b1856f2c7d6e5b0...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: 'c54b7b1856f2c7d6e5b0...', s: '67aa6395cd5daf7c398d...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0336cc5d5585177ae6b7',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0300f6253d1cb3df5817'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 2649e1be003aa65bc3b5...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '2649e1be003aa65bc3b5996825dcc11cee2bcb33b36fcf96178311b3791bc781',
gateway-1      |   initialC: '2649e1be003aa65bc3b5996825dcc11cee2bcb33b36fcf96178311b3791bc781',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 02c9680f3bcf8a84...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE (`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`status` IN (?,?) AND (`main`.`AnonymousFileAccess`.`status` = ? OR `main`.`AnonymousFileAccess`.`expiresAt` IS NULL OR `main`.`AnonymousFileAccess`.`expiresAt` >= ?)) ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:27:29.616Z] [INFO] [FileAccessService] Listed 0 files for publicKeyHash: 46f67d14534dafbd...
gateway-1      | [2025-10-22T05:27:29.616Z] [INFO] [AnonymousList] Listed 0 active / 0 revoked files for publicKeyHash: 46f67d14534dafbd... [547ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:27:29 +0000] "POST /api/files/anonymous-list HTTP/1.1" 200 178 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:27:54 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:24 +0000] "GET /api/auth/context HTTP/1.1" 200 1956 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:28:24 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:24 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | [Client Chunked Upload] Received upload request: {
gateway-1      |   fileName: 'Signage Document.pdf',
gateway-1      |   fileSize: 44809,
gateway-1      |   chunkCount: 1,
gateway-1      |   chunksLength: 1,
gateway-1      |   hasMetadataHash: true,
gateway-1      |   hasOwnershipProof: true,
gateway-1      |   hasRingSignature: true
gateway-1      | }
gateway-1      | [Client Chunked Upload] Verifying ownership proofs...
gateway-1      | [Client Chunked Upload] Schnorr proof verified
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '02e57e1eeb70b48dd4bb',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '03c80105d9e2fc11b2ac'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '02e57e1eeb70b48dd4bb',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '03c80105d9e2fc11b2ac'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 3, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 4, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '321f8243d371bae98889...', s: 'ef2f1d25716c5db9eb3f...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03513cd6f7589b27deeb',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03dc67f56faf4135ec78'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 52da788c47244cac67ca...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '52da788c47244cac67ca...', s: 'c1624b3953f924ff45a1...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '030c03f563b1ca32cce3',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '022ef4bc342b5b439814'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: 2f2c46a173873582e82a...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: '2f2c46a173873582e82a...', s: 'e4643aa6445001648e81...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0333143025c73b90ec0e',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0308627cb26635f4984e'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 883cff4fa5a29107c214...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '883cff4fa5a29107c214...', s: '8bbad1c8f7501157c5d2...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03b1dba16a6129804079',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03d5d156ef34e8a8fec4'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: 5d36aa94cefe8a8dcfe6...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: '5d36aa94cefe8a8dcfe6...', s: '9a8365fbe320b6c55db0...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02263ffafac12b90c047',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02f1f365573ed20c6d67'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 1d8ddc00bcec5a3e1e0c...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '1d8ddc00bcec5a3e1e0c...', s: 'cf2fb7ad1a1a10c52755...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '032d61b60802447a1241',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03e7369caa0722c8dec5'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 78723fb8b21761468feb...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '78723fb8b21761468feb...', s: 'c887208b986284dbd3f3...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03f133ec304c0b73f817',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0268a2e3ae560f373c92'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 321f8243d371bae98889...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '321f8243d371bae9888925eeaff2c46b13e741616b86a497d0cf0a7e1fa3c6d1',
gateway-1      |   initialC: '321f8243d371bae9888925eeaff2c46b13e741616b86a497d0cf0a7e1fa3c6d1',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Client Chunked Upload] Ring signature verified
gateway-1      | [Client Chunked Upload] Creating file record...
gateway-1      | prisma:query SELECT 1
gateway-1      | [Client Chunked Upload] File record created: 15301550-e05c-4b23-bd00-8d30100037d3
gateway-1      | [Client Chunked Upload] Creating chunk records...
gateway-1      | prisma:query INSERT INTO `main`.`File` (`id`, `fileName`, `totalSize`, `mimeType`, `chunkCount`, `metadata`, `metadataHash`, `encryptedChunkKeys`, `ringSignature`, `ringPublicKeys`, `escrowedIdentity`, `ownershipPublicKey`, `ownershipCreatedAt`, `uploaderId`, `uploaderPublicKeyHash`, `status`, `createdAt`, `updatedAt`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING `id` AS `id`, `fileName` AS `fileName`, `totalSize` AS `totalSize`, `mimeType` AS `mimeType`, `chunkCount` AS `chunkCount`, `metadata` AS `metadata`, `metadataHash` AS `metadataHash`, `encryptedChunkKeys` AS `encryptedChunkKeys`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `escrowedIdentity` AS `escrowedIdentity`, `ownershipPublicKey` AS `ownershipPublicKey`, `ownershipCreatedAt` AS `ownershipCreatedAt`, `uploaderId` AS `uploaderId`, `uploaderPublicKeyHash` AS `uploaderPublicKeyHash`, `status` AS `status`, `createdAt` AS `createdAt`, `updatedAt` AS `updatedAt`, `lastRevocationId` AS `lastRevocationId`, `lastRevocationAt` AS `lastRevocationAt`
gateway-1      | prisma:query BEGIN IMMEDIATE
gateway-1      | prisma:query INSERT INTO `main`.`FileChunk` (`fileId`, `chunkIndex`, `createdAt`, `id`, `ipfsCid`, `chunkHash`, `encryptedAt`, `size`) VALUES (?,?,?,?,?,?,?,?)
gateway-1      | prisma:query COMMIT
gateway-1      | [Client Chunked Upload] 1 chunk records created
gateway-1      | [Client Chunked Upload] Creating anonymous access record...
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousFileAccess` (`id`, `accessorPublicKeyHash`, `fileId`, `grantedAt`, `accessCount`, `keyStatus`, `keyPackageFingerprint`, `status`) VALUES (?,?,?,?,?,?,?,?) RETURNING `id` AS `id`, `accessorPublicKeyHash` AS `accessorPublicKeyHash`, `fileId` AS `fileId`, `grantedAt` AS `grantedAt`, `expiresAt` AS `expiresAt`, `lastAccessProof` AS `lastAccessProof`, `lastAccessAt` AS `lastAccessAt`, `accessCount` AS `accessCount`, `keyStatus` AS `keyStatus`, `keyPackageFingerprint` AS `keyPackageFingerprint`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:28:32.442Z] [INFO] [ClientChunkedUpload] File uploaded successfully: 15301550-e05c-4b23-bd00-8d30100037d3, 1 chunks, by publicKeyHash: b0175146c9589507... [332ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:32 +0000] "POST /api/files/client-chunked-upload HTTP/1.1" 201 599 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:36 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:37 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '0d5aeb8e618c8f4c8718...', s: '70d816f86ee7338721b1...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03871b4d84ec5aff6cb3',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0267af54839733941b3a'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 8df2fb64527f8712271f...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '8df2fb64527f8712271f...', s: 'cd77e156be25e7a1631d...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0313210a8113c333e769',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '035b0aecb1619c6d160d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: 8120d8d090acd4ff05ab...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: '8120d8d090acd4ff05ab...', s: '214db6dcf542bdd80400...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '020c8eae2865b2fb1949',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '032db60461d6703590eb'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: eabd9341afcddf347a79...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: 'eabd9341afcddf347a79...', s: '193bd9c3443f13b98441...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0235cf7d2f2c1c2fd819',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0247d96ccf2d10278462'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: 35cd94ea6ea532287084...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: '35cd94ea6ea532287084...', s: '9e275a4fec8894b68468...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03df989dfa5d133f73d7',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '035f1eda7e1945c91127'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 0f70a6479bb9a878b3e8...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '0f70a6479bb9a878b3e8...', s: 'c36a0368acbdd703ee06...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03b911db5d884577f271',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '031d8938a09dc7d716d4'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 129af9f7de388f9feffb...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '129af9f7de388f9feffb...', s: 'c125eab2357b09aaa206...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '035d8e7810ac88891a43',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0331d856937c907f2b36'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 0d5aeb8e618c8f4c8718...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '0d5aeb8e618c8f4c8718f8efd4ace8adee0ca39c5f731a67426bd69d73655e4d',
gateway-1      |   initialC: '0d5aeb8e618c8f4c8718f8efd4ace8adee0ca39c5f731a67426bd69d73655e4d',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 029193e22581e61d...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE (`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`status` IN (?,?) AND (`main`.`AnonymousFileAccess`.`status` = ? OR `main`.`AnonymousFileAccess`.`expiresAt` IS NULL OR `main`.`AnonymousFileAccess`.`expiresAt` >= ?)) ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`fileName`, `main`.`File`.`totalSize`, `main`.`File`.`chunkCount`, `main`.`File`.`mimeType`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`status`, `main`.`File`.`createdAt`, `main`.`File`.`updatedAt`, `main`.`File`.`lastRevocationAt` FROM `main`.`File` WHERE `main`.`File`.`id` IN (?) LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`FileChunk`.`id`, `main`.`FileChunk`.`chunkIndex`, `main`.`FileChunk`.`ipfsCid`, `main`.`FileChunk`.`chunkHash`, `main`.`FileChunk`.`fileId` FROM `main`.`FileChunk` WHERE `main`.`FileChunk`.`fileId` IN (?) ORDER BY `main`.`FileChunk`.`chunkIndex` ASC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:28:42.554Z] [INFO] [FileAccessService] Listed 1 files for publicKeyHash: b0175146c9589507...
gateway-1      | [2025-10-22T05:28:42.556Z] [INFO] [AnonymousList] Listed 1 active / 0 revoked files for publicKeyHash: b0175146c9589507... [350ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:28:42 +0000] "POST /api/files/anonymous-list HTTP/1.1" 200 1043 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:28:54 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:29:24 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:29:55 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:02 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:02 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /health HTTP/1.1" 200 90 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /api/files/test-ipfs HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:04 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | prisma:query SELECT 1
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '261e4ffe17918a8aa6bb...', s: 'fd11a6eae9139bb499a4...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03692a85920200f66b66',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '021e52cf388a5777b787'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 1116f6d94fe091d987c1...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '1116f6d94fe091d987c1...', s: '921a49df601aa91766c2...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03f8d49c47883208d52d',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03e0f32e2427839b1bfb'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: 3c5c42188c7e3bb356bd...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: '3c5c42188c7e3bb356bd...', s: '97a39cc78926b97740c8...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03fde5ea4d22ddfb2896',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02f46a2b21e7700de6e4'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: f52fdc20e5d2c9d8c351...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: 'f52fdc20e5d2c9d8c351...', s: '0e7cc0bf887da723166d...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03d353b18274bd0026e3',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '020130dab69f6af11403'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: f2fcb0180472930e7048...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'f2fcb0180472930e7048...', s: 'aef385dcd0d19d5f6742...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02c60f6a4bf88eba362c',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03d4cbddd6b52f5188ec'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 40310ec60740339c8270...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '40310ec60740339c8270...', s: 'ee14c0690c088bb715d4...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0200db98f0a092a18878',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03b67a8dbfb217d99849'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: b39fab814d0267341610...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: 'b39fab814d0267341610...', s: 'c2be8cf668472ce6812a...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0259823b04381efe0800',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02708637d5080c223689'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 261e4ffe17918a8aa6bb...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '261e4ffe17918a8aa6bb5eb6cc2b4956392ee167b0804a5955264925d1da7284',
gateway-1      |   initialC: '261e4ffe17918a8aa6bb5eb6cc2b4956392ee167b0804a5955264925d1da7284',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 029193e22581e61d...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE (`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`status` IN (?,?) AND (`main`.`AnonymousFileAccess`.`status` = ? OR `main`.`AnonymousFileAccess`.`expiresAt` IS NULL OR `main`.`AnonymousFileAccess`.`expiresAt` >= ?)) ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`fileName`, `main`.`File`.`totalSize`, `main`.`File`.`chunkCount`, `main`.`File`.`mimeType`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`status`, `main`.`File`.`createdAt`, `main`.`File`.`updatedAt`, `main`.`File`.`lastRevocationAt` FROM `main`.`File` WHERE `main`.`File`.`id` IN (?) LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`FileChunk`.`id`, `main`.`FileChunk`.`chunkIndex`, `main`.`FileChunk`.`ipfsCid`, `main`.`FileChunk`.`chunkHash`, `main`.`FileChunk`.`fileId` FROM `main`.`FileChunk` WHERE `main`.`FileChunk`.`fileId` IN (?) ORDER BY `main`.`FileChunk`.`chunkIndex` ASC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:30:07.020Z] [INFO] [FileAccessService] Listed 1 files for publicKeyHash: b0175146c9589507...
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:07 +0000] "POST /api/files/anonymous-list HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:17 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | prisma:query SELECT 1
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`status`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`uploaderPublicKeyHash` FROM `main`.`File` WHERE (`main`.`File`.`id` = ? AND 1=1) LIMIT ? OFFSET ?
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '0d38610509e7e5942c44...', s: 'f2951f485b39c0f1330b...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03b72ff693e2557117ec',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02b82f45a4028e86bab0'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: fd934c56b403fb4f2f9a...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: 'fd934c56b403fb4f2f9a...', s: 'c201e681fffeb12c94a0...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0333e7f32ef4b57ce305',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '028a6ba0384e0ae42966'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: f5b4eb0b35deb215dad8...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'f5b4eb0b35deb215dad8...', s: '5575f00eacb7a92b9dc0...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02b18ad4b8505d3dd6a5',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03de0687ace88e37c85e'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 1f2ef8f34a67958c10f2...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '1f2ef8f34a67958c10f2...', s: 'c2ab5a1d04befda2f1b0...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02cbd555a50d740c79ba',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0203822d99dece1f08ec'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: f147d038574f11fee408...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'f147d038574f11fee408...', s: '107ac880caebc27b59e4...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '030681d072ed05740228',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03ba2531fe8b831bd08f'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: d0034c79ec977d1a5cc5...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: 'd0034c79ec977d1a5cc5...', s: '22e7995df40ad8d428b7...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0300d1293007d1e6ae2f',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0372a45d3d0c39a70f0d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 76f81b8a59ad5ad6c335...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '76f81b8a59ad5ad6c335...', s: '212e8e3c018d7d498b00...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '030ef9bbc103c398dd02',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '031bf768b3393bb5d1a4'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 0d38610509e7e5942c44...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '0d38610509e7e5942c4407d635797396513707a95fbe80980e41713bd5048d02',
gateway-1      |   initialC: '0d38610509e7e5942c4407d635797396513707a95fbe80980e41713bd5048d02',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Key image already seen (double spend attempt?)
gateway-1      | [2025-10-22T05:30:23.651Z] [ERROR] [AnonymousGrantsList] Failed to list grants for file 15301550-e05c-4b23-bd00-8d30100037d3: Invalid ring signature [254ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:23 +0000] "POST /api/files/15301550-e05c-4b23-bd00-8d30100037d3/anonymous-grants/list HTTP/1.1" 400 50 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:30:25 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | prisma:query SELECT 1
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`status`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`uploaderPublicKeyHash` FROM `main`.`File` WHERE (`main`.`File`.`id` = ? AND 1=1) LIMIT ? OFFSET ?
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: 'd64bdc5b63a6431767d8...', s: '2d5dc89b1b11109aaeb7...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02cc76623cf2fdb4cb5f',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '030d5dc69ccc6d3158e8'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: ab86ffb12d57ffe8e6a4...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: 'ab86ffb12d57ffe8e6a4...', s: 'fcd79bf28bc6299e1b89...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02d3c22db7a4c1e0327d',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03a1e5d7533905daed87'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: e9cf7875d934a198f700...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'e9cf7875d934a198f700...', s: '4a3b6e6e903834618521...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03143ff3a0ade024915f',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03abe338ce71e477bb34'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: c24f974e57ea46f2f089...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: 'c24f974e57ea46f2f089...', s: 'f372ac7f0d8e679e3c57...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02c2558bb9e2a5e93c04',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03d9caeb9b09d7f6ddc0'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: df8c9454cad7a96faa9f...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'df8c9454cad7a96faa9f...', s: '1bd653b8b6fa46455348...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0307059c0a9e65738ceb',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '036cf1d2cdb09b3c6df3'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 4e7346a453baebd4e3fe...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '4e7346a453baebd4e3fe...', s: '5eb7410178955b6f2158...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02e10858b21b7fb26c89',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0200165ae15993c54e3b'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 1a5b1582172fb08cd8b7...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '1a5b1582172fb08cd8b7...', s: 'b9ddb915bfa7b4d024b5...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '033fced128aa9907149e',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03448848c415f9ac6372'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: d64bdc5b63a6431767d8...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: 'd64bdc5b63a6431767d8658a021ce9ec581d34b0ed4e6db949dc6268fe471829',
gateway-1      |   initialC: 'd64bdc5b63a6431767d8658a021ce9ec581d34b0ed4e6db949dc6268fe471829',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 029193e22581e61d...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE ((`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`fileId` = ?) AND 1=1) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousFileAccess` (`id`, `accessorPublicKeyHash`, `fileId`, `grantedAt`, `expiresAt`, `accessCount`, `keyStatus`, `keyPackageFingerprint`, `status`, `lastOwnerProof`) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING `id` AS `id`, `accessorPublicKeyHash` AS `accessorPublicKeyHash`, `fileId` AS `fileId`, `grantedAt` AS `grantedAt`, `expiresAt` AS `expiresAt`, `lastAccessProof` AS `lastAccessProof`, `lastAccessAt` AS `lastAccessAt`, `accessCount` AS `accessCount`, `keyStatus` AS `keyStatus`, `keyPackageFingerprint` AS `keyPackageFingerprint`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`, `status`, `revokedAt`, `lastOwnerProof`) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:30:44.196Z] [INFO] [AccessManagementService] Grant created for file 15301550-e05c-4b23-bd00-8d30100037d3: owner b0175146c9589507... -> 46f67d14534dafbd...
gateway-1      | [2025-10-22T05:30:44.197Z] [INFO] [AccessGrantChanged] Grant lifecycle event created for file 15301550-e05c-4b23-bd00-8d30100037d3
gateway-1      | [2025-10-22T05:30:44.197Z] [INFO] [AnonymousGrant] Grant created for file 15301550-e05c-4b23-bd00-8d30100037d3 to 46f67d14534dafbd... [241ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:44 +0000] "POST /api/files/15301550-e05c-4b23-bd00-8d30100037d3/anonymous-grants HTTP/1.1" 201 860 "-" "okhttp/4.9.2"
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`status`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`uploaderPublicKeyHash` FROM `main`.`File` WHERE (`main`.`File`.`id` = ? AND 1=1) LIMIT ? OFFSET ?
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '721e2cf41fe4eaac5038...', s: '63836675ec198c8454c4...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '020a4bde8fdcfd6ccfa4',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '035e14b2f244a272ef92'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 857eb0f2a140bbaf86f9...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '857eb0f2a140bbaf86f9...', s: '455627bb842145baa043...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03997071d6f6719d0130',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02356e11a2023e55b00c'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: ab018a580ab90eb7eb1c...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'ab018a580ab90eb7eb1c...', s: '707eb25b99567129f409...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03df90df2851c61eb909',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02f9bb639aa59e084ea3'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: e17560efe25071d18ef8...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: 'e17560efe25071d18ef8...', s: '01626564e8b95b58e822...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02a03e72a87b68ae8264',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '03a0cf9689fa26dffa8d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: 06520b5e9cf0854353be...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: '06520b5e9cf0854353be...', s: '7774676e2aacd6b7e401...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02b7f5e699d9994265f7',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '026ab5db72a64d7fef8d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 3d04ba694808e0e2fd68...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '3d04ba694808e0e2fd68...', s: '7764edd105edcd4b329d...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02c7b2f9406997d094f0',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0286d5e6ed5758b4e335'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: faea7e5e2e9ada4a1356...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: 'faea7e5e2e9ada4a1356...', s: '5ad070bb19de3d936516...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '030d463061ef56b7a377',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02fa076298b9e61bbfb7'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 721e2cf41fe4eaac5038...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '721e2cf41fe4eaac50382eaa14ba9edc142d37e54ca1dee8e60d0abeb5a274c9',
gateway-1      |   initialC: '721e2cf41fe4eaac50382eaa14ba9edc142d37e54ca1dee8e60d0abeb5a274c9',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:45 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 029193e22581e61d...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE `main`.`AnonymousFileAccess`.`fileId` = ? ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:30:45.886Z] [INFO] [AccessManagementService] Listed 2 grants for file 15301550-e05c-4b23-bd00-8d30100037d3 by owner b0175146c9589507...
gateway-1      | [2025-10-22T05:30:45.886Z] [INFO] [AnonymousGrantsList] Listed 2 grants for file 15301550-e05c-4b23-bd00-8d30100037d3 [132ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:45 +0000] "POST /api/files/15301550-e05c-4b23-bd00-8d30100037d3/anonymous-grants/list HTTP/1.1" 200 1376 "-" "okhttp/4.9.2"
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '60a190e8f018dfd18649...', s: '0498be77193f226ee9a8...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '039a6e60af623365d9cf',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '028cc0a87c9265c19cb9'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: 0a5b36f13f7b67a9b096...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: '0a5b36f13f7b67a9b096...', s: 'f38f0d5729729367cc00...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02b624ab099f90de5236',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '031664b850102c0f3eca'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: d5915cb0f8ef6881a650...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'd5915cb0f8ef6881a650...', s: 'a439bb890ba1ca8a73e2...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03636b11de698c38c35d',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '020d4fc7a8f1d0a748d5'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 7359e67ca0ea9f1f1091...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '7359e67ca0ea9f1f1091...', s: '44ed1064e5cbe4d8e3c9...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02dd79505bd6d51900f2',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0323d15227995a45b4b4'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: 0be32c542608327bfb28...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: '0be32c542608327bfb28...', s: '403b0cc7d6387bd8212c...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02c4e6c43b3a5aa4fe16',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0275d5a34f3a9d47ed2d'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 02aad40510404170c2ff...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '02aad40510404170c2ff...', s: '316eb0739a5f25deda2a...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0204b309cec49a32a492',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02bb840468f5c880ac85'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 3883266a14dd3f46396d...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '3883266a14dd3f46396d...', s: '7f9556e40aec75c1366e...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03b443e06975c81cfc60',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '023884042be53973eba5'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 60a190e8f018dfd18649...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '60a190e8f018dfd1864916272ab8dae20193c09f8d3a9cbc6602b996922c4ec6',
gateway-1      |   initialC: '60a190e8f018dfd1864916272ab8dae20193c09f8d3a9cbc6602b996922c4ec6',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Key image already seen (double spend attempt?)
gateway-1      | [2025-10-22T05:30:48.484Z] [ERROR] [AnonymousList] Error processing list request: Invalid ring signature [174ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:48 +0000] "POST /api/files/anonymous-list HTTP/1.1" 500 84 "-" "okhttp/4.9.2"
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:53 +0000] "GET /api/auth/context HTTP/1.1" 304 - "-" "okhttp/4.9.2"
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'nonce_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `metadata`, `timestamp`) VALUES (?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`ownershipPublicKey` FROM `main`.`File` WHERE 1=1 LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Fetched 7 public keys for ring
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '90c7b5bc7e0d47fae3ee...', s: '370139c134d9f9c8e0c9...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02b311a08e6389eaa35f',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '024dec682713c54cc9bd'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: c6102d06a5e9e07dfc8e...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: 'c6102d06a5e9e07dfc8e...', s: '97e13c0eb913a8def772...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03f4990b4d945d8a6d28',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02576cbbb364c2b57f39'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: a652790274a7e04460a9...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'a652790274a7e04460a9...', s: '5eff2957231d7a6be29f...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '0381fe2a62f025d603e9',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '022ceffe687b5a069b03'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 023713c2351bfb1534b7...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '023713c2351bfb1534b7...', s: '08a62c570217c01ffba8...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '028f60475db049227129',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0358de20a17574ae99de'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: a93575ee35775e1abf6c...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'a93575ee35775e1abf6c...', s: '78796498148e9017cd37...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03f06a682b1842015515',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02b27c884e13d697bd1c'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: ec49cada2d7c8cc3049d...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: 'ec49cada2d7c8cc3049d...', s: 'e80ff1d97aaa23858efb...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '023e45ef448d20cc02c7',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '030aecc41ad639e8927b'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: b37096c121f131c0cb2f...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: 'b37096c121f131c0cb2f...', s: 'fb436a572794f2afaad5...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '021abe014bbeca9f4a8c',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '034c5476b939e78dc6a8'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 90c7b5bc7e0d47fae3ee...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '90c7b5bc7e0d47fae3eeacb971b37b4bc8e9da17f210fba1e30d034bfffdc50d',
gateway-1      |   initialC: '90c7b5bc7e0d47fae3eeacb971b37b4bc8e9da17f210fba1e30d034bfffdc50d',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | prisma:query
gateway-1      |         DELETE FROM AnonymousAuditLog
gateway-1      |         WHERE eventType = 'key_image_verification'
gateway-1      |         AND timestamp < ?
gateway-1      |
gateway-1      | prisma:query SELECT `main`.`AnonymousAuditLog`.`id`, `main`.`AnonymousAuditLog`.`eventType`, `main`.`AnonymousAuditLog`.`fileId`, `main`.`AnonymousAuditLog`.`publicKeyHash`, `main`.`AnonymousAuditLog`.`deviceFingerprint`, `main`.`AnonymousAuditLog`.`ringSignature`, `main`.`AnonymousAuditLog`.`ringPublicKeys`, `main`.`AnonymousAuditLog`.`metadata`, `main`.`AnonymousAuditLog`.`timestamp`, `main`.`AnonymousAuditLog`.`status`, `main`.`AnonymousAuditLog`.`revokedAt`, `main`.`AnonymousAuditLog`.`lastOwnerProof` FROM `main`.`AnonymousAuditLog` WHERE (`main`.`AnonymousAuditLog`.`eventType` = ? AND `main`.`AnonymousAuditLog`.`metadata` LIKE ? AND `main`.`AnonymousAuditLog`.`timestamp` >= ?) ORDER BY `main`.`AnonymousAuditLog`.`timestamp` DESC LIMIT ? OFFSET ?
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `fileId`, `publicKeyHash`, `metadata`, `timestamp`, `status`) VALUES (?,?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [Ring Signature] Verification passed for keyImage: 02c9680f3bcf8a84...
gateway-1      | prisma:query SELECT `main`.`AnonymousFileAccess`.`id`, `main`.`AnonymousFileAccess`.`accessorPublicKeyHash`, `main`.`AnonymousFileAccess`.`fileId`, `main`.`AnonymousFileAccess`.`grantedAt`, `main`.`AnonymousFileAccess`.`expiresAt`, `main`.`AnonymousFileAccess`.`lastAccessProof`, `main`.`AnonymousFileAccess`.`lastAccessAt`, `main`.`AnonymousFileAccess`.`accessCount`, `main`.`AnonymousFileAccess`.`keyStatus`, `main`.`AnonymousFileAccess`.`keyPackageFingerprint`, `main`.`AnonymousFileAccess`.`status`, `main`.`AnonymousFileAccess`.`revokedAt`, `main`.`AnonymousFileAccess`.`lastOwnerProof` FROM `main`.`AnonymousFileAccess` WHERE (`main`.`AnonymousFileAccess`.`accessorPublicKeyHash` = ? AND `main`.`AnonymousFileAccess`.`status` IN (?,?) AND (`main`.`AnonymousFileAccess`.`status` = ? OR `main`.`AnonymousFileAccess`.`expiresAt` IS NULL OR `main`.`AnonymousFileAccess`.`expiresAt` >= ?)) ORDER BY `main`.`AnonymousFileAccess`.`grantedAt` DESC LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`File`.`id`, `main`.`File`.`fileName`, `main`.`File`.`totalSize`, `main`.`File`.`chunkCount`, `main`.`File`.`mimeType`, `main`.`File`.`ownershipPublicKey`, `main`.`File`.`status`, `main`.`File`.`createdAt`, `main`.`File`.`updatedAt`, `main`.`File`.`lastRevocationAt` FROM `main`.`File` WHERE `main`.`File`.`id` IN (?) LIMIT ? OFFSET ?
gateway-1      | prisma:query SELECT `main`.`FileChunk`.`id`, `main`.`FileChunk`.`chunkIndex`, `main`.`FileChunk`.`ipfsCid`, `main`.`FileChunk`.`chunkHash`, `main`.`FileChunk`.`fileId` FROM `main`.`FileChunk` WHERE `main`.`FileChunk`.`fileId` IN (?) ORDER BY `main`.`FileChunk`.`chunkIndex` ASC LIMIT ? OFFSET ?
gateway-1      | prisma:query INSERT INTO `main`.`AnonymousAuditLog` (`id`, `eventType`, `publicKeyHash`, `ringSignature`, `metadata`, `timestamp`) VALUES (?,?,?,?,?,?) RETURNING `id` AS `id`, `eventType` AS `eventType`, `fileId` AS `fileId`, `publicKeyHash` AS `publicKeyHash`, `deviceFingerprint` AS `deviceFingerprint`, `ringSignature` AS `ringSignature`, `ringPublicKeys` AS `ringPublicKeys`, `metadata` AS `metadata`, `timestamp` AS `timestamp`, `status` AS `status`, `revokedAt` AS `revokedAt`, `lastOwnerProof` AS `lastOwnerProof`
gateway-1      | [2025-10-22T05:30:54.650Z] [INFO] [FileAccessService] Listed 1 files for publicKeyHash: 46f67d14534dafbd...
gateway-1      | [2025-10-22T05:30:54.650Z] [INFO] [AnonymousList] Listed 1 active / 0 revoked files for publicKeyHash: 46f67d14534dafbd... [142ms]
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:30:54 +0000] "POST /api/files/anonymous-list HTTP/1.1" 200 1380 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:30:55 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"
gateway-1      | [2025-10-22T05:31:00.212Z] [INFO] [RevocationService] Preparing client-side re-encryption manifest for file 15301550-e05c-4b23-bd00-8d30100037d3
gateway-1      | [Ring Signature] Normalizing ring members to compressed format...
gateway-1      | [Ring Signature] Raw ring members received: [
gateway-1      |   '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7'
gateway-1      | ]
gateway-1      | [Ring Signature] Processing member 0: {
gateway-1      |   fullKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 1: {
gateway-1      |   fullKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 2: {
gateway-1      |   fullKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 3: {
gateway-1      |   fullKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 4: {
gateway-1      |   fullKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 5: {
gateway-1      |   fullKey: '03838231cad659ee9eaf3f2875e4ac9eda0e99a9cf56de568bd6694bf36b1de0d8',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Processing member 6: {
gateway-1      |   fullKey: '02e57e1eeb70b48dd4bbe0bd010505503db892e82e825323d46bc822c09e27d4b7',
gateway-1      |   length: 66,
gateway-1      |   type: 'string'
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 0: {
gateway-1      |   original: '02d5391e1c3926bc48a3',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02d5391e1c3926bc48a3',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 1: {
gateway-1      |   original: '02917370ea1f516c57b0',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02917370ea1f516c57b0',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 2: {
gateway-1      |   original: '02e43fdfcbbf9fb62edd',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e43fdfcbbf9fb62edd',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 3: {
gateway-1      |   original: '024fe936e790f54644f8',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '024fe936e790f54644f8',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 4: {
gateway-1      |   original: '03c80105d9e2fc11b2ac',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03c80105d9e2fc11b2ac',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 5: {
gateway-1      |   original: '03838231cad659ee9eaf',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '03838231cad659ee9eaf',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Normalized member 6: {
gateway-1      |   original: '02e57e1eeb70b48dd4bb',
gateway-1      |   originalLength: 66,
gateway-1      |   compressed: '02e57e1eeb70b48dd4bb',
gateway-1      |   compressedLength: 66
gateway-1      | }
gateway-1      | [Ring Signature] Comparing ring members: {
gateway-1      |   expectedCount: 7,
gateway-1      |   providedCount: 7,
gateway-1      |   expected: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ],
gateway-1      |   provided: [
gateway-1      |     '02d5391e1c3926bc48a3',
gateway-1      |     '02917370ea1f516c57b0',
gateway-1      |     '02e43fdfcbbf9fb62edd',
gateway-1      |     '024fe936e790f54644f8',
gateway-1      |     '03c80105d9e2fc11b2ac',
gateway-1      |     '03838231cad659ee9eaf',
gateway-1      |     '02e57e1eeb70b48dd4bb'
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Starting verification with: {
gateway-1      |   ringSize: 7,
gateway-1      |   keyImageLength: 66,
gateway-1      |   c0Length: 64,
gateway-1      |   sCount: 7,
gateway-1      |   ringMembersInOrder: [
gateway-1      |     { index: 0, prefix: '02d5391e1c3926bc48a3', suffix: 'a40008ac3d' },
gateway-1      |     { index: 1, prefix: '02917370ea1f516c57b0', suffix: '80c88a85c4' },
gateway-1      |     { index: 2, prefix: '02e43fdfcbbf9fb62edd', suffix: '85d74f950f' },
gateway-1      |     { index: 3, prefix: '024fe936e790f54644f8', suffix: '87913a8229' },
gateway-1      |     { index: 4, prefix: '03c80105d9e2fc11b2ac', suffix: '78504e9996' },
gateway-1      |     { index: 5, prefix: '03838231cad659ee9eaf', suffix: 'f36b1de0d8' },
gateway-1      |     { index: 6, prefix: '02e57e1eeb70b48dd4bb', suffix: 'c09e27d4b7' }
gateway-1      |   ]
gateway-1      | }
gateway-1      | [Ring Signature] Verifying member 0: { keyLength: 66, keyPrefix: '02d5391e1c', keySuffix: 'a40008ac3d' }
gateway-1      | [Ring Signature] Member 0 point created successfully
gateway-1      | [Ring Signature] Member 0 inputs: { currentC: '4ce86eb2a33bc3a4dd9d...', s: '8ae6834708e956767fb6...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02d5391e1c3926bc48a3
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=059ee87504de470e...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 0 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02c4dc12d2c261873d30',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02d07c10b10548902f56'
gateway-1      | }
gateway-1      | [Ring Signature] Member 0 computed next c: d3cff7a6a1e1c517f52d...
gateway-1      | [Ring Signature] Verifying member 1: { keyLength: 66, keyPrefix: '02917370ea', keySuffix: '80c88a85c4' }
gateway-1      | [Ring Signature] Member 1 point created successfully
gateway-1      | [Ring Signature] Member 1 inputs: { currentC: 'd3cff7a6a1e1c517f52d...', s: 'b5d3abee7880c0974a93...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02917370ea1f516c57b0
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=5d53f5f7bbb9cc92...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 1 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03e574474d33a13ae618',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '031cdc547cfd93e0f692'
gateway-1      | }
gateway-1      | [Ring Signature] Member 1 computed next c: b9e970011ace4f6e4f5f...
gateway-1      | [Ring Signature] Verifying member 2: { keyLength: 66, keyPrefix: '02e43fdfcb', keySuffix: '85d74f950f' }
gateway-1      | [Ring Signature] Member 2 point created successfully
gateway-1      | [Ring Signature] Member 2 inputs: { currentC: 'b9e970011ace4f6e4f5f...', s: '70331b67e288d5cfa44e...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e43fdfcbbf9fb62edd
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=606a8a7154eddf51...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 2 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '039b1e555b359adf6a7e',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '0208302df70dac3debf7'
gateway-1      | }
gateway-1      | [Ring Signature] Member 2 computed next c: 95065359bf1d92a06d5a...
gateway-1      | [Ring Signature] Verifying member 3: { keyLength: 66, keyPrefix: '024fe936e7', keySuffix: '87913a8229' }
gateway-1      | [Ring Signature] Member 3 point created successfully
gateway-1      | [Ring Signature] Member 3 inputs: { currentC: '95065359bf1d92a06d5a...', s: '1ede73fac8b015e5f931...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 024fe936e790f54644f8
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=a5087f63fcc23f4b...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 3 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02df7098a8f7caf89434',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '034c41547fe425f5f1a7'
gateway-1      | }
gateway-1      | [Ring Signature] Member 3 computed next c: b024742481187eca2f1a...
gateway-1      | [Ring Signature] Verifying member 4: { keyLength: 66, keyPrefix: '03c80105d9', keySuffix: '78504e9996' }
gateway-1      | [Ring Signature] Member 4 point created successfully
gateway-1      | [Ring Signature] Member 4 inputs: { currentC: 'b024742481187eca2f1a...', s: 'f656a73b2bdfcc6bb083...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03c80105d9e2fc11b2ac
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=9fb9f9c06f999480...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 4 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03e0d8c29453be1ad7df',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02ccf7bf527ccf31db50'
gateway-1      | }
gateway-1      | [Ring Signature] Member 4 computed next c: 060d367bda9a0d819934...
gateway-1      | [Ring Signature] Verifying member 5: { keyLength: 66, keyPrefix: '03838231ca', keySuffix: 'f36b1de0d8' }
gateway-1      | [Ring Signature] Member 5 point created successfully
gateway-1      | [Ring Signature] Member 5 inputs: { currentC: '060d367bda9a0d819934...', s: '1cf602a3a95816da509e...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 03838231cad659ee9eaf
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=4763cadeaf194678...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 5 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '02bb124f7531b468b452',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02bcc66fe02ccc903d2c'
gateway-1      | }
gateway-1      | [Ring Signature] Member 5 computed next c: 85cb8d2d29473a031426...
gateway-1      | [Ring Signature] Verifying member 6: { keyLength: 66, keyPrefix: '02e57e1eeb', keySuffix: 'c09e27d4b7' }
gateway-1      | [Ring Signature] Member 6 point created successfully
gateway-1      | [Ring Signature] Member 6 inputs: { currentC: '85cb8d2d29473a031426...', s: '6d86a7576d669d6056f9...' }
gateway-1      | [hashToPoint] Input publicKeyHex: 02e57e1eeb70b48dd4bb
gateway-1      | [hashToPoint] counter=0, bytes=[0,0,0,0], digest=15d9fc40f7601b00...
gateway-1      | [hashToPoint] Success at counter=0
gateway-1      | [Ring Signature] Member 6 L/R points: {
gateway-1      |   LLength: 33,
gateway-1      |   LPrefix: '03a56b57c16692648a88',
gateway-1      |   RLength: 33,
gateway-1      |   RPrefix: '02713615785e925d0d26'
gateway-1      | }
gateway-1      | [Ring Signature] Member 6 computed next c: 4ce86eb2a33bc3a4dd9d...
gateway-1      | [Ring Signature] Final verification check: {
gateway-1      |   finalC: '4ce86eb2a33bc3a4dd9d33c3dd5a2ee29379d4ca0bc58904da40767c8b32d964',
gateway-1      |   initialC: '4ce86eb2a33bc3a4dd9d33c3dd5a2ee29379d4ca0bc58904da40767c8b32d964',
gateway-1      |   matches: true
gateway-1      | }
gateway-1      | [Ring Signature] ✓ Verification successful!
gateway-1      | [Ring Signature] LSAG cryptographic verification passed
gateway-1      | [Ring Signature] Key image already seen - treating as linked activity
gateway-1      | [Ring Signature] Key image already seen (double spend attempt?)
gateway-1      | [2025-10-22T05:31:00.509Z] [WARN] [RevocationService] Ring signature verification failed for client manifest preparation
gateway-1      | [2025-10-22T05:31:00.509Z] [ERROR] [RevocationService] Client manifest preparation error: Invalid ring signature for revocation
gateway-1      | [Route] Revocation manifest prepare error: Error: Invalid ring signature for revocation
gateway-1      |     at prepareClientReencryption (/app/src/services/revocationService.js:305:15)
gateway-1      |     at async /app/src/routes/files.js:604:24
gateway-1      | 192.168.65.1 - - [22/Oct/2025:05:31:00 +0000] "POST /api/files/revocation/prepare HTTP/1.1" 400 65 "-" "okhttp/4.9.2"
gateway-1      | 127.0.0.1 - - [22/Oct/2025:05:31:25 +0000] "HEAD /health HTTP/1.1" 200 90 "-" "Wget/1.21.3"