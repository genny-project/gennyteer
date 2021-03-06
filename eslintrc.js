module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  plugins: ['babel', 'jest'],
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  globals: {
    describe: true,
    it: true,
    after: true,
    beforeAll: true
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'space-in-parens': [
      'error',
      'always',
      { exceptions: ['{}', '()', 'empty'] }
    ],
    'space-before-function-paren': 'off',
    'arrow-body-style': 'off',
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/imports-first': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': 'off',
    'no-case-declarations': 'off',
    'no-param-reassign': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'brace-style': 'off',
    'no-plusplus': 'off',
    eqeqeq: 'off',
    'no-unused-expressions': 'off',
    'no-nested-ternary': 'off',
    curly: 'off',
    'no-return-assign': 'off',
    'no-confusing-arrow': 'off',
    'no-extra-boolean-cast': 'off',
    'no-console': 'off'
  }
};
