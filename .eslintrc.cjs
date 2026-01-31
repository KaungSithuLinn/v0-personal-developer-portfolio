module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    // Allow short-term 'any' usage in migrations but warn
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
