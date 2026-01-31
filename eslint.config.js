const { FlatCompat } = require("@eslint/eslintrc");

// Use FlatCompat to reuse existing shareable configs like `next` in a flat config
const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // re-use the same configs we had in .eslintrc.cjs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // allow short-term 'any' usage in migrations but warn
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
