# Current Demo Status

- Backend: Upload pipeline (AOT generation, chunk encryption, anonymous revocation) complete; download access plan now includes manifest delivery, integrity alerts, and audit logging endpoints to implement next (`GET /api/files/:id/access`, `POST /api/files/:id/integrity-alert`, `POST /api/files/:id/audit`).
- Mobile: Upload demo solid; next sprint adds `DownloadFlowScreen`, `ChunkProgressCard`, and `useDownloadFlow` hook driving key orchestration, chunk progress, and telemetry submission.
- Dependencies: `@noble/secp256k1` remains the crypto backbone; monitor for updates before hardening the download proof-of-concept.
- Pending (Demo Roadmap): wire download manifest API, integrity retry UX, audit timeline modal, and optional encrypted offline cache toggle for presentation.
