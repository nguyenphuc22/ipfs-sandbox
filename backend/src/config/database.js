const { PrismaClient } = require('./prismaClient');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
