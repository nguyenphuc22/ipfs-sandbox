
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  publicKey: 'publicKey',
  displayLabel: 'displayLabel',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FileScalarFieldEnum = {
  id: 'id',
  fileName: 'fileName',
  totalSize: 'totalSize',
  mimeType: 'mimeType',
  chunkCount: 'chunkCount',
  metadata: 'metadata',
  metadataHash: 'metadataHash',
  encryptedChunkKeys: 'encryptedChunkKeys',
  ringSignature: 'ringSignature',
  ringPublicKeys: 'ringPublicKeys',
  escrowedIdentity: 'escrowedIdentity',
  ownershipPublicKey: 'ownershipPublicKey',
  ownershipCreatedAt: 'ownershipCreatedAt',
  uploaderId: 'uploaderId',
  uploaderPublicKeyHash: 'uploaderPublicKeyHash',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastRevocationId: 'lastRevocationId',
  lastRevocationAt: 'lastRevocationAt'
};

exports.Prisma.FileChunkScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  chunkIndex: 'chunkIndex',
  chunkHash: 'chunkHash',
  ipfsCid: 'ipfsCid',
  size: 'size',
  encryptedAt: 'encryptedAt',
  createdAt: 'createdAt'
};

exports.Prisma.AnonymousRevocationScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  revokedPublicKeyHash: 'revokedPublicKeyHash',
  proofR: 'proofR',
  proofS: 'proofS',
  proofMessage: 'proofMessage',
  proofTimestamp: 'proofTimestamp',
  ringSignature: 'ringSignature',
  ringPublicKeys: 'ringPublicKeys',
  chunksReencrypted: 'chunksReencrypted',
  revocationStrategy: 'revocationStrategy',
  createdAt: 'createdAt',
  executedBySystem: 'executedBySystem'
};

exports.Prisma.IntegrityAlertScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  chunkIndex: 'chunkIndex',
  expectedHash: 'expectedHash',
  actualHash: 'actualHash',
  reportedByPublicKeyHash: 'reportedByPublicKeyHash',
  reportedAt: 'reportedAt',
  resolved: 'resolved',
  resolvedAt: 'resolvedAt',
  resolution: 'resolution'
};

exports.Prisma.AnonymousFileAccessScalarFieldEnum = {
  id: 'id',
  accessorPublicKeyHash: 'accessorPublicKeyHash',
  fileId: 'fileId',
  grantedAt: 'grantedAt',
  expiresAt: 'expiresAt',
  lastAccessProof: 'lastAccessProof',
  lastAccessAt: 'lastAccessAt',
  accessCount: 'accessCount',
  keyStatus: 'keyStatus',
  keyPackageFingerprint: 'keyPackageFingerprint',
  status: 'status',
  revokedAt: 'revokedAt',
  lastOwnerProof: 'lastOwnerProof'
};

exports.Prisma.AnonymousAuditLogScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  fileId: 'fileId',
  publicKeyHash: 'publicKeyHash',
  deviceFingerprint: 'deviceFingerprint',
  ringSignature: 'ringSignature',
  ringPublicKeys: 'ringPublicKeys',
  metadata: 'metadata',
  timestamp: 'timestamp',
  status: 'status',
  revokedAt: 'revokedAt',
  lastOwnerProof: 'lastOwnerProof'
};

exports.Prisma.AnonymousSharingRequestScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  sharerPublicKeyHash: 'sharerPublicKeyHash',
  recipientPublicKeyHash: 'recipientPublicKeyHash',
  ownershipProof: 'ownershipProof',
  ringSignature: 'ringSignature',
  keyPackageFingerprint: 'keyPackageFingerprint',
  status: 'status',
  requestedAt: 'requestedAt',
  respondedAt: 'respondedAt'
};

exports.Prisma.SignatureScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  signerId: 'signerId',
  ringUserIds: 'ringUserIds',
  signature: 'signature',
  isOpened: 'isOpened',
  openingProof: 'openingProof',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  File: 'File',
  FileChunk: 'FileChunk',
  AnonymousRevocation: 'AnonymousRevocation',
  IntegrityAlert: 'IntegrityAlert',
  AnonymousFileAccess: 'AnonymousFileAccess',
  AnonymousAuditLog: 'AnonymousAuditLog',
  AnonymousSharingRequest: 'AnonymousSharingRequest',
  Signature: 'Signature'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
