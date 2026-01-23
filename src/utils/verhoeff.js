// Verhoeff algorithm implementation for Aadhaar checksum validation
// Based on the Verhoeff algorithm for decimal numbers

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates an Aadhaar number using Verhoeff algorithm
 * @param {string} aadhaar - The 12-digit Aadhaar number
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return false;

  // Remove any non-numeric characters
  const cleanAadhaar = aadhaar.replace(/\D/g, '');

  // Must be exactly 12 digits
  if (cleanAadhaar.length !== 12) return false;

  // All characters must be digits
  if (!/^\d{12}$/.test(cleanAadhaar)) return false;

  // Verhoeff algorithm
  let c = 0;
  const digits = cleanAadhaar.split('').map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[i % 8][digits[i]]];
  }

  return c === 0;
}

/**
 * Formats Aadhaar number with masking (XXXX-XXXX-1234)
 * @param {string} value - The input value
 * @returns {string} - Formatted Aadhaar number
 */
export function formatAadhaar(value) {
  if (!value) return '';

  // Remove non-numeric characters
  const numeric = value.replace(/\D/g, '');

  // Limit to 12 digits
  const limited = numeric.slice(0, 12);

  // Format with dashes
  if (limited.length <= 4) {
    return limited;
  } else if (limited.length <= 8) {
    return `${limited.slice(0, 4)}-${limited.slice(4)}`;
  } else {
    return `${limited.slice(0, 4)}-${limited.slice(4, 8)}-${limited.slice(8)}`;
  }
}

/**
 * Masks Aadhaar number for display (XXXX-XXXX-XXXX)
 * @param {string} aadhaar - The Aadhaar number
 * @returns {string} - Masked Aadhaar number
 */
export function maskAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.length < 12) return aadhaar;

  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length !== 12) return aadhaar;

  return 'XXXX-XXXX-XXXX';
}

/**
 * Generates a secure hash/token for Aadhaar (for storage)
 * @param {string} aadhaar - The Aadhaar number
 * @returns {string} - Hashed/tokenized Aadhaar
 */
export function hashAadhaar(aadhaar) {
  // In production, use proper hashing like bcrypt or argon2
  // For demo, we'll use a simple hash
  if (!aadhaar) return '';

  const clean = aadhaar.replace(/\D/g, '');
  // Simple hash for demo - replace with proper crypto in production
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase();
}
