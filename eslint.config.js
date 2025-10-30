import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Enforce 2 spaces indentation and forbid tabs
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-tabs': 'error'
      // Prefer value imports rather than always using `import type` when possible
      ,
      '@typescript-eslint/consistent-type-imports': ['error', { 'prefer': 'no-type-imports' }]
    }
  },
])
