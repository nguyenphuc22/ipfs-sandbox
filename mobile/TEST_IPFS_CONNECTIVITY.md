# Mobile ↔ Gateway Connectivity Checklist

Use this guide to verify that the React Native client can communicate with the hardened IPFS gateway across simulators, emulators, and physical devices.

## 1. Environment Prerequisites

- Backend stack running: `docker compose up -d`
- Gateway reachable from host: `curl http://localhost:3000/health`
- Mobile dependencies installed: `npm install` (plus `pod install` for iOS)
- Metro bundler running: `npm start`

## 2. Network Targets

| Platform           | Gateway URL                         |
| ------------------ | ----------------------------------- |
| iOS Simulator      | `http://localhost:3000`             |
| Android Emulator   | `http://10.0.2.2:3000`              |
| Physical Device    | `http://<host-ip>:3000`             |

Set the value in `mobile/src/config/api.ts` (or pass via `useIPFS({ config })`).

## 3. Smoke Tests

1. **Launch the app** (`npm run ios` / `npm run android`).
2. **Check connection widget** – it should display `Connected`.
3. **Run in-app health check** – tap `Refresh`; confirm timestamp updates.

If any step fails:
- Verify Docker containers are running (`docker compose ps`).
- Ensure simulators/emulators share the same network as the host.
- Confirm no VPN/firewall is blocking port 3000.

## 4. File Operations

### 4.1 Upload + Download (Basic)
1. Use `IPFSFileUpload` section to select a file.
2. Confirm success toast and the file appearing in the list.
3. Tap `View` to stream the file via `/api/files/:hash`.

### 4.2 AOT Upload with Schnorr Proof
1. In `AOTDemoCard`, provide:
   - `metadataHash` (SHA-256 of metadata payload).
   - `ownershipPublicKey` and matching Schnorr proof (`R`, `s`, `message`).
   - Optional ring signature JSON and escrowed identity.
2. Submit and confirm the gateway returns `{ success: true, fileId, cid }`.

### 4.3 Anonymous Revocation
1. Provide the `fileId` from the previous step.
2. Sign a fresh revocation message (fresh nonce, Schnorr proof, LSAG ring signature).
3. Submit and ensure the API responds with `{ success: true, revocationId }`.

## 5. Failure Scenarios

Test resiliency by deliberately inducing issues:
- **Network Loss**: disable host networking; app should show `Disconnected` and recover when restored.
- **Gateway Down**: `docker compose stop gateway`; verify error messaging, then restart and confirm recovery.
- **Invalid Proofs**: send mismatched Schnorr or ring signature; backend should return HTTP 400.

## 6. Log Capture

- **Gateway**: `docker logs ipfs-sandbox-gateway-1 -f`
- **React Native**: `npx react-native log-ios` or `log-android`
- **Metro**: monitor packager console for JS errors

## 7. Exit Criteria

Connectivity is considered verified when:
- Health checks succeed across all target platforms.
- Standard uploads, downloads, and AOT flows complete without errors.
- Revocation returns a valid `revocationId` and file list reflects updates.
- The app surfaces meaningful feedback when connectivity is interrupted.

Document the device/emulator, OS version, IP configuration, and test timestamps for audit trails.
