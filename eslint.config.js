const js = require('@eslint/js')
const typescriptParser = require('@typescript-eslint/parser')
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin')
const globals = require('globals')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  { ignores: ['**/*.js', 'node_modules'] },
  {
    files: ['src/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.browser,
        NodeListOf: false,
      },
      sourceType: 'module',
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      'no-inner-declarations': 'off',
      'no-unused-vars': 'warn',
      // 'no-var': 'off', // Note: Disabled due to issues with target ES5, consider ES2020
    },
  },
]
