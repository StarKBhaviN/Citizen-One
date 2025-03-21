import crypto from "crypto"

/**
 * Generate a unique complaint ID
 * @param {string} prefix - Prefix for the ID (default: CMP)
 * @param {number} year - Year (2 digits)
 * @param {number} month - Month (2 digits)
 * @param {number} sequence - Sequence number
 * @returns {string} - Formatted complaint ID
 */
export const generateComplaintId = (prefix = "CMP", year, month, sequence) => {
  // Format year to 2 digits
  const yearStr = year.toString().padStart(2, "0").slice(-2)

  // Format month to 2 digits
  const monthStr = month.toString().padStart(2, "0")

  // Format sequence to 4 digits
  const sequenceStr = sequence.toString().padStart(4, "0")

  // Return formatted ID
  return `${prefix}-${yearStr}-${monthStr}-${sequenceStr}`
}

/**
 * Generate a random token
 * @param {number} length - Length of the token
 * @returns {string} - Random token
 */
export const generateToken = (length = 20) => {
  return crypto.randomBytes(length).toString("hex")
}

/**
 * Generate a reference number
 * @param {string} prefix - Prefix for the reference number
 * @returns {string} - Reference number
 */
export const generateReferenceNumber = (prefix = "REF") => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}${timestamp}${random}`
}

