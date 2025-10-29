# Adjudicator Service Runbook

## 1. Provision Keys
1. Navigate to `adjudicator/`
2. Install dependencies (first run):
   ```bash
   npm install
   ```
3. Generate Schnorr + ECIES keys:
   ```bash
   npm run generate:keys
   ```
4. Copy the output into:
   - `adjudicator/.env`
   - `backend/.env` (`ADJUDICATOR_PUBLIC_KEY`, `ADJUDICATOR_SERVICE_URL`) and `ADMIN_HMAC_SECRET`

## 2. Configure Environment
```
# adjudicator/.env
DATABASE_URL="file:../backend/data/app.db"
PORT=4000
ADJUDICATOR_PRIVATE_KEY=...
ADJUDICATOR_PUBLIC_KEY=...
ADJUDICATOR_ECIES_PRIVATE_KEY=...
ADJUDICATOR_ECIES_PUBLIC_KEY=...
ADMIN_APPROVAL_HMAC_SECRET=...
# ADMIN_APPROVAL_MAX_SKEW_MS=300000
TOKEN_TTL_MS=600000
TOKEN_RATE_LIMIT_PER_HOUR=100
```
```
# backend/.env (append)
ADJUDICATOR_SERVICE_URL="http://localhost:4000"
ADJUDICATOR_PUBLIC_KEY=...
ADMIN_API_KEY="demo-admin-key"   # optional
ADMIN_HMAC_SECRET="demo-hmac-secret"
# Keep ADMIN_HMAC_SECRET in sync with adjudicator ADMIN_APPROVAL_HMAC_SECRET
```

## 3. Start Services
```bash
# Terminal 1 - adjudicator
cd adjudicator
npm run dev

# Terminal 2 - backend
cd backend
npm run dev
```

## 4. Smoke Test Upload Flow
1. Use mobile app (`AOTUploadModal`) to upload.
2. Confirm database rows:
   ```bash
   npx prisma studio --schema=backend/prisma/schema.prisma
   ```
   - `File`, `ValidationToken`, `ValidationTokenAudit`, `ValidationNonce`
3. Verify `AnonymousAuditLog` has `validationTokenId` metadata.

## 5. Investigation Demo
1. Visit `http://localhost:3000/admin/index.html`
2. Enter admin API key, user, HMAC secret.
3. Trigger `/api/admin/investigate` using seeded file ID.
4. Optionally ban/unban keys and flag files.

## 6. Automated Checks
```bash
# Backend unit/integration tests
cd backend
npm test -- ValidationTokenVerifier
npm test -- admin
npm test -- anonymous-upload.validation
```

## 7. Seed Demo Data
```bash
node scripts/seed-investigation-demo.js
```

## 8. Troubleshooting
- **401 Invalid admin signature**: ensure HMAC secret matches backend `.env` and signature generation is enabled.
- **Rate limit exceeded**: reset via `DELETE FROM ValidationTokenAudit`. For demo use, increase `TOKEN_RATE_LIMIT_PER_HOUR`.
- **Nonce already used**: regenerate nonce (mobile UI handles automatically) or clear `ValidationNonce` table for clean slate.
- **Adjudicator unavailable**: restart service or adjust `ADJUDICATOR_SERVICE_URL`.

## 9. Cleanup
- Stop services with `Ctrl+C`
- Truncate demo data as needed via Prisma Studio or SQL (e.g., delete seeded rows from `File`, `ValidationToken`, `ValidationTokenAudit`, `AnonymousAuditLog`, `BannedUser`).
