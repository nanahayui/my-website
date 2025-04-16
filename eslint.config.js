import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import astroPlugin from 'eslint-plugin-astro'

export default tseslint.config(
  // グローバル設定
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    env: {
      node: true,
      es2022: true,
      browser: true,
    },
  },

  // ESLint推奨ルール
  eslint.configs.recommended,

  // Astro基本設定
  ...astroPlugin.configs['flat/recommended'],

  // Astroアクセシビリティ設定
  ...astroPlugin.configs['flat/jsx-a11y-strict'],

  // TypeScript設定（すべてのファイル用）
  ...tseslint.configs.recommended,

  // Astroファイル固有の設定
  {
    files: ['**/*.astro'],
    parser: astroPlugin.parser,
    parserOptions: {
      parser: tseslint.parser,
      extraFileExtensions: ['.astro'],
    },
  },

  // TypeScriptファイル固有の設定
  {
    files: ['**/*.ts'],
    ...tseslint.configs.recommended,
  },

  // Astroスクリプト内のJSファイル設定
  {
    files: ['**/*.astro/*.js', '*.astro/*.js'],
    parser: tseslint.parser,
  },
)
