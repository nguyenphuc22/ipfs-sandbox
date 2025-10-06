# Current Demo Status

- Backend: Registration, ring-context, LSAG ring signature (create/verify), AOT upload, and anonymous revocation flows now fully enforced with Schnorr + ring validation; download/view APIs unchanged.
- Mobile: `AOTDemoCard` continues to drive manual uploads and revocations against the hardened endpoints; mobile services now target the live gateway exclusively.
- Dependencies: `@noble/secp256k1` powers both Schnorr and LSAG flows—run `npm install` in `backend/` if dependencies drift.
- Pending: Production-grade storage, adjudicator identity escrow processing, and automated chunk re-encryption are still outside the current prototype scope.
