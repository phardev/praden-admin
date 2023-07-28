module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      ts: '@typescript-eslint/parser',
      '<template>': 'espree'
    }
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': 'off',
    'keyword-spacing': ['error'],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0
      }
    ],
    'no-multi-spaces': ['error'],
    'eol-last': ['error'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': [
      'error',
      {
        afterColon: true
      }
    ],
    'vue/multi-word-component-names': 'off'
  }
}
