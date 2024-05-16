// const DOMGlobals = ['window', 'document']
// const NodeGlobals = ['module', 'require']
// const ViteGlobals = ['defineProps']

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js', 'node_modules/', 'dist/'],
  parserOptions: {
    ecmaVersion: 2020,
    // sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/**/tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'node'],
  // plugins: ['@typescript-eslint', 'prettier', 'node'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:eslint-comments/recommended'],
  env: {
    node: true,
  },
  rules: {
    // 'prettier/prettier': 'error',
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
    // 控制逗号前后的空格
    'comma-spacing': ['error', { before: false, after: true }],
    // 控制逗号在行尾出现还是在行首出现
    'comma-style': ['error', 'last'],
    // indent: ['error', 2, { SwitchCase: 2 }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: ['packages/shared/**'],
      rules: {
        'no-restricted-globals': 'off',
      },
    },
    {
      files: ['packages/front/**/*.vue'], // Specify the extension or pattern you want to parse as JSON.
      parser: 'vue-eslint-parser',
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: {
          ts: '@typescript-eslint/parser',
          '<template>': 'espree',
        },
        // sourceType: 'module',
        project: ['./tsconfig.eslint.json', './packages/front/tsconfig.json'],
        vueFeatures: {
          filter: true,
        },
      },
      extends: ['plugin:vue/vue3-essential', '@vue/typescript/recommended', './packages/front/.eslintrc-auto-import.json'],
      env: {
        'vue/setup-compiler-macros': true,
      },
      rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      },
      globals: { RouterNext: true },
    },
    {
      files: ['packages/**/*spec.ts'], // Specify the extension or pattern you want to parse as JSON.
      env: {
        node: true,
        jest: true,
      }
    },
    {
      files: ['*.json', '*.jsonc'], // Specify the extension or pattern you want to parse as JSON.
      parser: 'jsonc-eslint-parser', // Set this parser.
      parserOptions: {
        jsonSyntax: 'JSON5',
      },
    },
  ],
}
