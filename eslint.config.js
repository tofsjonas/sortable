import pkg from '@eslint/js'
import typescriptParser from '@typescript-eslint/parser'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
const { configs } = pkg

export default [
  configs.recommended,
  eslintPluginPrettierRecommended,
  { ignores: ['**/*.js', 'node_modules'] },
  {
    files: ['src/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
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
