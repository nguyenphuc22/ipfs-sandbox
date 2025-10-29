# Issue Plan: Hybrid Adjudicator Investigation Flow

**Last Updated:** 2025-10-28

## Status Snapshot (2025-10-27)
- DONE: Adjudicator microservice scaffold + endpoints
	- Code present: `adjudicator/src/index.ts`, routes `/api/validate-upload` and `/api/decrypt-escrow`
	- Services: `ValidationService.ts`, `InvestigationService.ts` with Prisma wired via `adjudicator/src/config/prisma.ts` (reuses backend client)
	- .env template: `adjudicator/.env.example` (PORT, TOKEN_TTL_MS, TOKEN_RATE_LIMIT_PER_HOUR, key pairs)
- DONE: Backend accepts client-chunked manifest WITH ValidationToken and EscrowedIdentity
	- Path: `backend/src/routes/anonymous-endpoints-addition.js` → `POST /api/files/client-chunked-upload`
	- Verifications: ValidationToken signature+TTL+hash+nonce (`verifyValidationToken`), nonce uniqueness (`ValidationNonce`), Schnorr proof, optional Ring signature
	- Persistence: creates `File`, `FileChunk`, `ValidationToken` (relation), `AnonymousFileAccess`, and audit log entries
- DONE: Prisma schema for Investigation + Token audit and nonce store
	- Models: `ValidationToken`, `InvestigationAudit`, `ValidationTokenAudit`, `ValidationNonce`, `BannedUser` in `backend/prisma/schema.prisma`
- DONE: Mobile integrates token + escrow + client-chunked upload
	- `GatewayApiService.requestValidationToken()` calls adjudicator
	- `createEscrowedIdentity()` implemented at `mobile/src/services/crypto/escrow.ts`
	- UI flow wired in `mobile/src/components/ipfs/AOTUploadModal.tsx` (requests token, builds escrow, calls `/client-chunked-upload`)
- DONE: Backend admin investigation API (Phase 1)
	- Path: `backend/src/routes/admin.js` → `POST /api/admin/investigate` with optional `X-Admin-Key` guard and HMAC signature enforcement (`ADMIN_HMAC_SECRET`); forwards to adjudicator; logs via `secureLog`
- DONE: Minimal admin dashboard console served from `backend/public/admin/index.html`
- DONE: Key management and deployment runbook (`docs/adjudicator_runbook.md`) + seed script (`scripts/seed-investigation-demo.js`)
- IN PROGRESS: Automated/integration tests (investigate E2E pending)

## Task Backlog (Theo New_Thesis.md §4)

### 1. Adjudicator Layer-1 Policy Enforcement
- [IN-PROD CODE] Endpoints and services exist
	- Files: `adjudicator/src/routes/validate.ts`, `adjudicator/src/services/ValidationService.ts`, `adjudicator/src/index.ts`
- [DONE] Prisma wiring and audit storage
	- Uses backend Prisma client: `adjudicator/src/config/prisma.ts`
	- Models present: `ValidationTokenAudit`, `BannedUser`
- [TODO] Key material provisioning
	- Generate and set: `ADJUDICATOR_PRIVATE_KEY`, `ADJUDICATOR_PUBLIC_KEY`, `ADJUDICATOR_ECIES_PRIVATE_KEY`, `ADJUDICATOR_ECIES_PUBLIC_KEY`
	- Store .env from `adjudicator/.env.example` or load from vault
- [IN PROGRESS] Unit tests for: TTL/nonce validated (`ValidationTokenVerifier.test.js` present in backend); banned user & rate-limit tests pending for adjudicator
- [INFO] Health endpoint available at `/health`

### 2. Mobile Upload Dual-Layer Instrumentation
- [DONE] Token request integration: `AOTUploadModal.tsx` → `GatewayApiService.requestValidationToken()`
- [DONE] Escrow package: `mobile/src/services/crypto/escrow.ts` (v1 envelope JSON, xchacha20poly1305, secp ECDH)
- [DONE] Client-chunked upload payload includes token+escrow: `GatewayApiService.uploadWithClientChunking()`
- [IN PROGRESS] Tests (Jest): ValidationToken verifier unit coverage complete; pending network timeout scenarios on mobile
- [DONE] Docs updated in `mobile/README.md` (Hybrid Adjudicator upload note)

### 3. Backend Upload Verification Pipeline
- [DONE] ValidationToken verification implemented in `anonymous-endpoints-addition.js`
	- Functions: `verifyValidationToken`, `ensureNonceUnique`
	- Route: `POST /api/files/client-chunked-upload`
- [DONE] Persistence of token and escrow on `File` + `ValidationToken`
- [DONE] ValidationToken verifier unit tests + route-level integration tests (`anonymous-upload.validation.test.js`, `admin.routes.test.js`)

### 4. Admin Investigation Escalation (Backend Phase 1)
- [DONE] Route exists: `backend/src/routes/admin.js` → `/api/admin/investigate`
- [DONE] Optional API key auth with `X-Admin-Key`; forwards to adjudicator and logs
- [DONE] Hardened auth: HMAC signature (`ADMIN_HMAC_SECRET`) + optional API key implemented; JWT/ring signature pending per thesis requirements
- [DONE] Ban/unban endpoints (`POST /api/admin/ban`, `DELETE /api/admin/ban/:publicKey`) and static dashboard integrate with API
- [IN PROGRESS] Tests: error propagation covered; add cases for missing/invalid admin auth (HMAC/API key)

### 5. Adjudicator Investigation Engine (Phase 2-5)
- [DONE] Endpoint implemented: `adjudicator/src/routes/investigate.ts`
- [DONE] Decrypt escrow, cross-reference userPublicKeyHash, compute metrics and red flags: `InvestigationService.ts`
- [DONE] Admin approval HMAC signature verification and stricter `legalAuthorization` checks implemented
- [TODO] Add ring signature consistency check if required by thesis step 9c
- [TODO] Unit/integration tests (happy path + failures)

### 6. Admin Dashboard & Follow-up (Phase 6)
- [DONE] Lightweight dashboard at `backend/public/admin/index.html` (fetch-based console with ban/unban actions)
- [DONE] File flagging workflow via `/api/admin/files/:fileId/flag` and dashboard integration
- [DONE] Admin auth flow (HMAC + API key) implemented; [TODO] multi-factor / delegated auth
- [TODO] E2E dry-run and screenshot capture

### 7. Demo Enablement (Master’s Thesis)
- [IN PROGRESS] Materials partially present; runbook (`docs/adjudicator_runbook.md`) and seed script (`scripts/seed-investigation-demo.js`) exist; flesh out remaining demo steps
- [TODO] Seed: create users, banned list, sample files; create revocation patterns for red flags
- [TODO] Runbook with commands and expected logs; fallback video
- [TODO] Screencast and JSON logs for appendix

### 8. Ops Scripts (Status/Cleanup)
- [TODO] Update `check-status.sh` to include Adjudicator
	- Add health probe: `http://localhost:4000/health` with retries and status line `Adjudicator: ✓ Active`/`✗ Inactive`.
	- Print a hint when inactive: “Adjudicator not managed by Docker; start it separately in adjudicator/ (npm run start).”
	- Optional: quick POST smoke to `/api/validate-upload` when env `DEMO_FAKE_PUBLIC_KEY` present.
- [TODO] Keep Docker/IPFS checks aligned to compose
	- Confirm container name patterns match: `ipfs-sandbox-gateway-1`, `ipfs-sandbox-ipfs-node-{i}-1` (compose default project name).
	- Keep IPFS API check as `POST /api/v0/version` and gateway `GET /`.
- [TODO] Review `clean-docker.sh` messages
	- Note that Adjudicator runs outside Docker and is not stopped by this script.
	- Ensure SQLite cleanup covers `./backend/data/*.db` (already in place) and logs.

### 9. Start Script Unification (`start-system.sh`)
- [TODO] Add Adjudicator health check
	- After gateway & IPFS checks, call `http://localhost:4000/health` and print `Adjudicator: ✓ Ready`/`✗ Not running`.
	- If not running, print guidance: `cd adjudicator && cp .env.example .env && npm i && npm run start`.
- [TODO] Optional auto-start Adjudicator (opt-in)
	- When env `START_ADJUDICATOR=1` (or `--with-adjudicator` flag), spawn adjudicator in background using `npm run start` from `adjudicator/`, write PID to `.adjudicator.pid`, wait for `/health`.
	- On failure, print last 20 lines of adjudicator console output for troubleshooting.
- [TODO] Output URLs
	- Add `Adjudicator API:   http://localhost:4000` to “System URLs” section.
- [TODO] Acceptance
	- Running only `./start-system.sh` should leave the system in a state ready to demo Upload + Investigation (assuming adjudicator .env keys are set).

## Quick Pointers (for agent)
- Backend server entry: `backend/src/server.js` mounts anonymous routes first, then legacy `files.js`
- Client-chunked route with token verification: `backend/src/routes/anonymous-endpoints-addition.js` (search for `verifyValidationToken`, `client-chunked-upload`)
- Admin investigate API: `backend/src/routes/admin.js` (env: `ADMIN_API_KEY` optional)
- Prisma models: `backend/prisma/schema.prisma` (ensure `npx prisma generate` ran → `backend/generated/prismaClient`)
- Adjudicator bootstrap: `adjudicator/src/index.ts`; config in `adjudicator/.env` (copy from `.env.example`)
- Mobile upload flow: `mobile/src/components/ipfs/AOTUploadModal.tsx`; services in `mobile/src/services/GatewayApiService.ts` and `mobile/src/services/crypto/escrow.ts`

## Environment & Config Matrix
- Backend
	- Required env: `DATABASE_URL` (sqlite path), `ADJUDICATOR_PUBLIC_KEY` (hex), `ADJUDICATOR_SERVICE_URL`, optional `ADMIN_API_KEY`, `ADMIN_HMAC_SECRET`, `IPFS_API_URL`
	- Entrypoint: `backend/src/server.js`
	- Prisma client: `backend/generated/prismaClient`
- Adjudicator
	- Required env: `DATABASE_URL`, `ADJUDICATOR_PRIVATE_KEY`, `ADJUDICATOR_PUBLIC_KEY`, `ADJUDICATOR_ECIES_PRIVATE_KEY`, `ADJUDICATOR_ECIES_PUBLIC_KEY`, `ADMIN_APPROVAL_HMAC_SECRET`, `PORT`, `TOKEN_TTL_MS`, `TOKEN_RATE_LIMIT_PER_HOUR` (optional `ADMIN_APPROVAL_MAX_SKEW_MS`)
	- Example: `adjudicator/.env.example`
	- Entrypoint: `adjudicator/src/index.ts` (exposes `/health`, `/api/validate-upload`, `/api/decrypt-escrow`)
- Mobile
	- Required config: `API_CONFIG.adjudicatorUrl` (used by `GatewayApiService`), `API_CONFIG.baseUrl`, `API_CONFIG.ipfsGatewayUrl`
	- Token request → `adjudicatorUrl` must be reachable from device/emulator

## Next Steps (actionable)
1) Provision keys and start adjudicator
	- Configure `ADJUDICATOR_*` keys in `adjudicator/.env`, set `DATABASE_URL` to point to backend DB, run the service on port 4000 (see `docs/adjudicator_runbook.md`).
2) Smoke test client-chunked upload
	- Use mobile app to request token, upload a small file; confirm `ValidationToken` and `File` rows persisted and nonce consumed.
3) Harden investigation auth and add tests
	- Implement admin signature verification and add integration tests for `/api/admin/investigate` and `/api/decrypt-escrow`.
4) Polish admin UI experience
	- Extend console with richer report rendering (charts/export) beyond current flag/ban functionality.
5) Demo runbook and seed
	- Add seed script for users/files/revocations; prepare logs/screenshots.

## Dependencies & Risks
- Chưa chốt cơ chế lưu khoá Adjudicator (vault/HSM) → blocker cho task 1.
- Phụ thuộc security team định nghĩa chuẩn adminAuthorization (task 4 & 5).
- Redis/nonces chưa cấu hình trong môi trường staging; cần quyết định dùng Redis thật hay bảng Prisma.

## Exit Criteria
- Upload bị reject nếu thiếu/invalid ValidationToken; escrowedIdentity luôn được lưu.
- Investigation report khớp template thesis (đủ 8 mục) và log audit đầy đủ.
- Admin dashboard cho phép kích hoạt investigate, nhận report, ban publicKey; mọi hành động có log.
- Demo runbook chạy trơn tru ít nhất 3 lần liên tiếp, có artifact chứng minh (screencast + log).
