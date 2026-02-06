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
 * @property {number} id
 * @property {number} client
 * @property {string} client_name
 * @property {number} consultant
 * @property {string} consultant_name
 * @property {string} title
 * @property {string} description
 * @property {string} file
 * @property {'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'} status
 * @property {string} created_at
 * @property {string} uploaded_at
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
 * @typedef {Object} SharedReport
 * @property {number} id
 * @property {number} consultant
 * @property {string} consultant_name
 * @property {number} client
 * @property {string} client_name
 * @property {string} title
 * @property {string} description
 * @property {string} file
 * @property {'CMA' | 'GST' | 'TAX' | 'AUDIT' | 'OTHER'} report_type
 * @property {string} created_at
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

export { };
