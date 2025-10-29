if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'wasm';
}
if (!process.env.PRISMA_QUERY_ENGINE_TYPE) {
  process.env.PRISMA_QUERY_ENGINE_TYPE = process.env.PRISMA_CLIENT_ENGINE_TYPE;
}

const { PrismaClient } = require('../../generated/prismaClient');

module.exports = {
  PrismaClient,
};
