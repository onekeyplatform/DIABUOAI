const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["dist", "node_modules", "*.config.js"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
