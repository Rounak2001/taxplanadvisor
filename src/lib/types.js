// Type definitions as JSDoc comments for IDE support

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} consultantId
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} pan
 * @property {string} gstin
 * @property {'active' | 'pending' | 'inactive'} status
 * @property {string} avatarUrl
 * @property {string} createdAt
 * @property {string} lastActivity
 */

/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {string} consultantId
 * @property {string} clientId
 * @property {string} name
 * @property {'bank_statement' | 'pan_card' | 'gst_return' | 'itr' | 'other'} type
 * @property {'draft' | 'submitted' | 'checker_review' | 'approved' | 'rejected'} status
 * @property {string} uploadedAt
 * @property {string} [checkedAt]
 * @property {string} [checkerId]
 * @property {Object} extractedData
 */

/**
 * @typedef {Object} ActivityItem
 * @property {string} id
 * @property {string} clientId
 * @property {'whatsapp' | 'call' | 'email' | 'document' | 'system'} type
 * @property {string} title
 * @property {string} description
 * @property {string} timestamp
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} clientId
 * @property {'sent' | 'received'} direction
 * @property {string} content
 * @property {string} timestamp
 * @property {'sent' | 'delivered' | 'read'} status
 * @property {'text' | 'template' | 'document'} type
 */

/**
 * @typedef {Object} GSTRecord
 * @property {string} id
 * @property {string} consultantId
 * @property {string} clientId
 * @property {string} gstin
 * @property {string} supplierName
 * @property {string} invoiceNo
 * @property {string} invoiceDate
 * @property {number} booksValue
 * @property {number} gstr2bValue
 * @property {number} difference
 * @property {'matched' | 'unmatched' | 'missing_in_books' | 'missing_in_gstr2b'} status
 */

/**
 * @typedef {Object} CMAData
 * @property {string} id
 * @property {string} consultantId
 * @property {string} clientId
 * @property {string} businessName
 * @property {string} financialYear
 * @property {'draft' | 'in_progress' | 'completed'} status
 * @property {Object} basicInfo
 * @property {Object} balanceSheet
 * @property {Object} profitLoss
 * @property {Object} ratios
 */

/**
 * @typedef {Object} ConsentRecord
 * @property {string} id
 * @property {string} consultantId
 * @property {string} clientId
 * @property {string} purpose
 * @property {string} consentDate
 * @property {'active' | 'revoked' | 'expired'} status
 * @property {string} expiryDate
 */

export {};
