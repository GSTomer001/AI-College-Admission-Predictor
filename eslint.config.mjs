/**
 * ESLint flat config for the whole monorepo.
 * - frontend/: browser + JSX (React) with jsx-uses-vars so JSX component
 *   usage counts as variable usage for no-unused-vars.
 * - backend/: Node.js CommonJS
 * Run: npx eslint .     (from the repo root)
 */
import globals from "globals";
import react from "eslint-plugin-react";

const frontendFiles = ["frontend/src/**/*.{js,jsx}"];
const backendFiles = ["backend/**/*.js"];
const ignores = [
  "**/node_modules/**",
  "**/dist/**",
  "**/package-lock.json",
  "**/*.log",
  "ai-model/**",
];

/** Core sanity rules shared by both configs. */
const coreRules = {
  "no-undef": "error",
  "no-dupe-keys": "error",
  "no-unreachable": "error",
  "no-constant-condition": "error",
  "no-redeclare": "error",
  "no-duplicate-case": "error",
  "valid-typeof": "error",
};

export default [
  { ignores },

  // ---- Frontend (React, browser, ESM + JSX) ----
  {
    files: frontendFiles,
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      ...coreRules,
      // Mark JSX identifiers as usages so imports used in JSX aren't flagged.
      "react/jsx-uses-vars": "error",
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
    },
  },

  // ---- Backend (Node.js, CommonJS) ----
  {
    files: backendFiles,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      ...coreRules,
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
    },
  },
];
