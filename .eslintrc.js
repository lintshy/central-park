module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'unused-imports',
    'simple-import-sort',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['node_modules/', '.expo/', 'dist/'],
  rules: {
    // ── React ────────────────────────────────────────────────────────────────
    'react/react-in-jsx-scope': 'off',   // not needed with React 17+ JSX transform
    'react/prop-types': 'off',           // TypeScript covers this

    // ── TypeScript ───────────────────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'off', // delegated to unused-imports below

    // ── Unused imports / vars ────────────────────────────────────────────────
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    // ── Import sort order ────────────────────────────────────────────────────
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // ── React Native ─────────────────────────────────────────────────────────
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-single-element-style-arrays': 'error',

    // ── General ──────────────────────────────────────────────────────────────
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
  },
};
