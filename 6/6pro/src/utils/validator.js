/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a positive number
 * @param {number} value
 * @returns {boolean}
 */
const isPositiveNumber = (value) => {
  return typeof value === 'number' && value > 0;
};

/**
 * Sanitizes string input
 * @param {string} str
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>/g, '');
};

module.exports = { isValidEmail, isPositiveNumber, sanitizeString };
