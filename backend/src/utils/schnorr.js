let schnorrModulePromise;

async function loadSchnorrFromCurves() {
    const module = await import('@noble/curves/secp256k1.js');
    if (module && module.schnorr && typeof module.schnorr.verify === 'function') {
        return module.schnorr;
    }
    throw new Error('Schnorr implementation not found in @noble/curves/secp256k1');
}

function loadLegacySchnorr() {
    try {
        const legacy = require('@noble/secp256k1');
        if (legacy && legacy.schnorr && typeof legacy.schnorr.verify === 'function') {
            return legacy.schnorr;
        }
    } catch (error) {
        // Ignore require errors and fall through to throw below
    }
    return null;
}

async function getSchnorr() {
    if (!schnorrModulePromise) {
        schnorrModulePromise = loadSchnorrFromCurves().catch((error) => {
            const fallback = loadLegacySchnorr();
            if (fallback) {
                return fallback;
            }
            throw error;
        });
    }
    return schnorrModulePromise;
}

module.exports = {
    getSchnorr,
};
