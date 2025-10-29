const fs = require('fs');
const path = require('path');

function resolveDatabasePath() {
  const url = process.env.DATABASE_URL || 'file:./data/app.db';
  if (!url.startsWith('file:')) {
    return null;
  }
  const filePath = url.slice('file:'.length);
  const resolved = path.resolve(__dirname, '..', '..', filePath);
  return resolved;
}

function ensureDatabaseFile() {
  if (process.env.SKIP_DB_BOOTSTRAP === 'true') {
    return;
  }

  const dbPath = resolveDatabasePath();
  if (!dbPath) {
    return;
  }

  const templatePath = path.resolve(__dirname, '..', '..', 'prisma', 'data', 'app.db');
  if (!fs.existsSync(templatePath)) {
    console.warn('[DatabaseInit] Template database not found, skipping bootstrap');
    return;
  }

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let shouldCopy = false;
  if (!fs.existsSync(dbPath)) {
    shouldCopy = true;
  } else {
    try {
      const stats = fs.statSync(dbPath);
      if (stats.size < 1024) {
        shouldCopy = true;
      }
    } catch (error) {
      shouldCopy = true;
    }
  }

  if (!shouldCopy) {
    return;
  }

  try {
    fs.copyFileSync(templatePath, dbPath);
    console.log(`[DatabaseInit] Initialized database from template: ${dbPath}`);
  } catch (error) {
    console.error('[DatabaseInit] Failed to initialize database', error);
  }
}

module.exports = {
  ensureDatabaseFile,
};
