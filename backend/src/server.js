const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import shared Prisma instance
const prisma = require('./config/database');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'IPFS Gateway with ID-RS'
    });
});

// Routes (sẽ thêm sau)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Import and initialize anonymous routes with shared Prisma instance
const { router: anonymousRoutes, init: initAnonymousRoutes } = require('./routes/anonymous-endpoints-addition');
initAnonymousRoutes(prisma);
app.use('/api/files', anonymousRoutes); // Mount anonymous routes first to take precedence for specific paths
app.use('/api/files', require('./routes/files')); // Legacy routes (will only handle paths not matched by anonymous routes)

app.use('/api/signatures', require('./routes/signatures'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Gateway server running on port ${PORT}`);
    console.log(`📁 IPFS API: http://localhost:5001`);
    console.log(`🌐 IPFS Gateway: http://localhost:8080`);
});