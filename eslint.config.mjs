import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'lib/**',
      'dist/**',
      'node_modules/**',
      'example/compile/**',
      'example/*.min.js',
      // Vendored fork of quill-better-table — kept close to upstream so it can
      // still be diffed against it. Linting it would mean rewriting it.
      'modules/quill-better-table/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.flat.recommended.rules,
      // The package targets React >= 16.8, where the JSX runtime makes the
      // `React` import optional and prop-types are not used.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // This codebase carries several regexes lifted verbatim from upstream
      // sources (URL matching, mobile detection, markdown shortcuts). Their
      // redundant escapes are harmless, and hand-editing them risks changing
      // what they match — so flag, do not fail.
      'no-useless-escape': 'warn',
      // `cond && doSomething()` is used throughout this codebase as a guard.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },

  // The remaining plain-JS modules predate the TypeScript migration; they are
  // checked for real errors but not held to the typed rules.
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-this-alias': 'off',
    },
  },

  {
    files: ['scripts/**/*.mjs', 'rollup.config.mjs', 'eslint.config.mjs'],
    languageOptions: { globals: { ...globals.node } },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  },

  // The demo page runs from plain <script> tags and picks React, ReactDOM and
  // the upload helpers up off the window.
  {
    files: ['example/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
        ReactDOM: 'readonly',
        request: 'readonly',
        apiURL: 'readonly',
        ajaxFormPostOptions: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },

  prettier,
);
