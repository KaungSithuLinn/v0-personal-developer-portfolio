/**
 * This file helps resolve dependency conflicts
 * It's used by some package managers like Yarn
 *
 * Current resolutions:
 * - date-fns: Using v2.30.0 to be compatible with react-day-picker
 */

module.exports = {
  resolutions: {
    "date-fns": "^2.30.0",
  },
}
