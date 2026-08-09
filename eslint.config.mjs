import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import jsoncParser from 'jsonc-eslint-parser'
import autoImportGlobals from './packages/front/.eslintrc-auto-import.json' with { type: 'json' }

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/dev-dist/**', '**/.eslintrc.js', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,ts,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
  ...pluginVue.configs['flat/essential'],
  {
    files: ['packages/front/**/*.{vue,ts,tsx}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...(autoImportGlobals.globals || {}),
        RouterNext: 'readonly',
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['packages/**/*spec.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.{json,jsonc}'],
    languageOptions: {
      parser: jsoncParser,
      parserOptions: {
        jsonSyntax: 'JSON5',
      },
    },
  }
)
