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

// Simple test route for debugging
router.get('/viewtest', (req, res) => {
    res.json({ message: 'View test route works' });
});

// Test route to verify view pattern works
router.get('/view/test', (req, res) => {
    res.json({ message: 'View pattern works!' });
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

// Helper function to detect content type from filename
function getContentType(filename = '') {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const contentTypes = {
        // Text files
        'txt': 'text/plain',
        'md': 'text/markdown',
        'csv': 'text/csv',
        'json': 'application/json',
        'xml': 'application/xml',
        
        // Document files
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        
        // Spreadsheet files
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        
        // Image files
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
        
        // Video files
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mkv': 'video/x-matroska',
        
        // Audio files
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'flac': 'audio/flac',
        
        // Archive files
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/gzip'
    };
    
    return contentTypes[ext] || 'application/octet-stream';
}

// Get file metadata from IPFS  
router.get('/metadata/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        
        // Get file stats from IPFS
        const ipfsProcess = spawn('ipfs', ['object', 'stat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let statOutput = '';
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            statOutput += data.toString();
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
                // Parse stats output
                const lines = statOutput.trim().split('\n');
                const metadata = {};
                lines.forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    if (key && valueParts.length > 0) {
                        metadata[key.trim()] = valueParts.join(':').trim();
                    }
                });
                
                res.json({
                    success: true,
                    hash: hash,
                    metadata: metadata
                });
            } else {
                console.error('IPFS object stat error:', errorOutput);
                res.status(500).json({
                    error: 'Failed to get file metadata from IPFS',
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
        console.error('Metadata retrieval error:', error.message);
        res.status(500).json({ 
            error: 'Failed to retrieve file metadata from IPFS',
            details: error.message
        });
    }
});

// View file content from IPFS with proper content type - BEFORE :hash route
router.get('/view/:hash', async (req, res) => {
    console.log('VIEW ROUTE HIT:', req.params, req.query);
    try {
        const { hash } = req.params;
        
        // Validate IPFS hash format for view route too
        console.log('VIEW route validating hash:', hash);
        if (!hash.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{50,})$/)) {
            console.log('VIEW hash validation failed for:', hash);
            return res.status(404).json({ error: 'Invalid IPFS hash format' });
        }
        console.log('VIEW hash validation passed for:', hash);
        const { filename } = req.query; // Optional filename for content-type detection
        
        // Use direct IPFS command
        const ipfsProcess = spawn('ipfs', ['cat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let fileBuffer = Buffer.alloc(0);
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
                // Detect content type
                const contentType = getContentType(filename);
                const displayFilename = filename || `${hash}.bin`;
                
                // Set appropriate headers for viewing
                res.set({
                    'Content-Type': contentType,
                    'Content-Disposition': `inline; filename="${displayFilename}"`,
                    'Content-Length': fileBuffer.length,
                    'Cache-Control': 'public, max-age=3600'
                });
                
                // For text files, convert to string; for binary files, send buffer
                if (contentType.startsWith('text/') || contentType === 'application/json') {
                    res.send(fileBuffer.toString('utf8'));
                } else {
                    res.send(fileBuffer);
                }
            } else {
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
        console.error('File view error:', error.message);
        res.status(500).json({ 
            error: 'Failed to view file from IPFS',
            details: error.message
        });
    }
});

// Get file from IPFS (download) - MUST BE LAST due to :hash parameter
router.get('/:hash', async (req, res) => {
    console.log('HASH ROUTE HIT:', req.params, req.query);
    try {
        const { hash } = req.params;
        
        // Validate IPFS hash format (Qm... or bafy...)
        console.log('Validating hash:', hash);
        if (!hash.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{50,})$/)) {
            console.log('Hash validation failed for:', hash);
            return res.status(404).json({ error: 'Invalid IPFS hash format' });
        }
        console.log('Hash validation passed for:', hash);
        const { download, view, filename } = req.query; // ?download=true or ?view=true
        
        // Use direct IPFS command instead of HTTP API to avoid 405 issues
        const ipfsProcess = spawn('ipfs', ['cat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let fileBuffer = Buffer.alloc(0);
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
                if (view === 'true') {
                    // View mode - detect content type and send with proper headers
                    const contentType = getContentType(filename);
                    const displayFilename = filename || `${hash}.bin`;
                    
                    res.set({
                        'Content-Type': contentType,
                        'Content-Disposition': `inline; filename="${displayFilename}"`,
                        'Content-Length': fileBuffer.length,
                        'Cache-Control': 'public, max-age=3600'
                    });
                    
                    // For text files, convert to string; for binary files, send buffer
                    if (contentType.startsWith('text/') || contentType === 'application/json') {
                        res.send(fileBuffer.toString('utf8'));
                    } else {
                        res.send(fileBuffer);
                    }
                } else {
                    // Download mode - send as binary
                    const disposition = download === 'true' ? 'attachment' : 'inline';
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': `${disposition}; filename="${hash}"`,
                        'Content-Length': fileBuffer.length
                    });
                    res.send(fileBuffer);
                }
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
