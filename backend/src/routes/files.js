const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { spawn } = require('child_process');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// IPFS API endpoint - use internal container address
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

// Upload file to IPFS
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        const ipfsResponse = response.data;
        const hash = ipfsResponse.Hash;

        res.json({
            success: true,
            hash: hash,
            name: req.file.originalname,
            size: req.file.size,
            ipfsUrl: `http://localhost:8080/ipfs/${hash}`,
            apiUrl: `http://localhost:5001/api/v0/cat?arg=${hash}`
        });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ 
            error: 'Failed to upload file to IPFS',
            details: error.message 
        });
    }
});

// Test IPFS API connectivity
router.get('/test-ipfs', async (req, res) => {
    try {
        const testResponse = await axios.post(`${IPFS_API_URL}/api/v0/version`);
        res.json({
            success: true,
            ipfsApiUrl: IPFS_API_URL,
            ipfsVersion: testResponse.data
        });
    } catch (error) {
        res.status(500).json({
            error: 'IPFS API test failed',
            ipfsApiUrl: IPFS_API_URL,
            details: error.message
        });
    }
});

// List files (placeholder - would need database integration)
router.get('/', (req, res) => {
    res.json({ 
        message: 'File listing requires database integration',
        note: 'Use /upload to add files and /:hash to retrieve them'
    });
});

// Get file from IPFS - MUST BE LAST due to :hash parameter
router.get('/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        
        // Use direct IPFS command instead of HTTP API to avoid 405 issues
        const ipfsProcess = spawn('ipfs', ['cat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let fileContent = '';
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            fileContent += data.toString();
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
                // Success - send the file content
                res.set({
                    'Content-Type': 'text/plain',
                    'Content-Disposition': `inline; filename="${hash}.txt"`
                });
                res.send(fileContent);
            } else {
                // Error
                console.error('IPFS cat error:', errorOutput);
                res.status(500).json({
                    error: 'Failed to retrieve file from IPFS',
                    details: errorOutput || 'IPFS command failed',
                    exitCode: code
                });
            }
        });

        ipfsProcess.on('error', (error) => {
            console.error('IPFS process error:', error);
            res.status(500).json({
                error: 'Failed to spawn IPFS process',
                details: error.message
            });
        });

    } catch (error) {
        console.error('Retrieval error:', error.message);
        res.status(500).json({ 
            error: 'Failed to retrieve file from IPFS',
            details: error.message,
            ipfsApiUrl: IPFS_API_URL
        });
    }
});

module.exports = router;
