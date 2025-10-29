"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// MUST load .env BEFORE importing any other modules that read process.env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const validate_1 = __importDefault(require("./routes/validate"));
const investigate_1 = __importDefault(require("./routes/investigate"));
const prisma_1 = require("./config/prisma");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT ?? 4000);
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'adjudicator',
        timestamp: new Date().toISOString(),
    });
});
app.use('/api', validate_1.default);
app.use('/api', investigate_1.default);
const server = app.listen(PORT, () => {
    console.log(`🔐 Adjudicator service listening on port ${PORT}`);
});
const shutdown = async () => {
    console.log('Shutting down adjudicator service...');
    server.close();
    await prisma_1.prisma.$disconnect();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
