/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    webextensions: true,
  },
  plugins: ["@typescript-eslint", "promise"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-strongly-recommended",
    "eslint:recommended",
    "plugin:promise/recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  ignorePatterns: ["vite.config.ts"],
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  rules: {
    "func-names": "error",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "require-await": "error",
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "promise/prefer-await-to-then": "error",
    "promise/always-return": "warn",
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "no-restricted-syntax": "off",
    "no-use-before-define": [
      "error",
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    "no-magic-numbers": ["error", { ignoreArrayIndexes: true, ignore: [0, 1] }],
  },
};
