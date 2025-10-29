import path from 'path';
import dotenv from 'dotenv';

// MUST load .env BEFORE importing any other modules that read process.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import validateRouter from './routes/validate';
import investigateRouter from './routes/investigate';
import { prisma } from './config/prisma';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'adjudicator',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', validateRouter);
app.use('/api', investigateRouter);

const server = app.listen(PORT, () => {
  console.log(`🔐 Adjudicator service listening on port ${PORT}`);
});

const shutdown = async () => {
  console.log('Shutting down adjudicator service...');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
