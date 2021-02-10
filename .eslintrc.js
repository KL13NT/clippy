module.exports = {
  extends: ["standard", "eslint:recommended", "prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
    "jest/globals": true,
  },
  plugins: ["prettier", "jest"],
  rules: {
    "no-tabs": 0,
    "no-async-promise-executor": ["off"],
    "no-empty-pattern": ["off"],
    "no-undef": ["error"],
    "no-var": ["error"],
    "object-curly-spacing": ["error", "always"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "spaced-comment": ["off"],
    "no-prototype-builtins": ["off"],
    "sort-keys": ["off"],
    "space-before-function-paren": ["off"],
    indent: ["off"],
  },
};
