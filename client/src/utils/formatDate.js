/**
 * formatDate.js — Date formatting utilities
 *
 * Centralising date logic here means:
 *  - Changing the display format (e.g. locale) is a one-line change
 *  - Components stay clean — no raw Date manipulation in JSX
 */

/**
 * Formats an ISO date string for display in the UI.
 * Example: "2025-12-31T00:00:00.000Z" → "Dec 31, 2025"
 *
 * @param {string|Date|null} dateStr
 * @returns {string|null}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
};

/**
 * Converts an ISO date string to the yyyy-mm-dd format required
 * by an <input type="date"> element.
 * Example: "2025-12-31T00:00:00.000Z" → "2025-12-31"
 *
 * @param {string|Date|null} dateStr
 * @returns {string}
 */
export const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};
