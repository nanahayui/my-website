# コードスタイルと規約

## ESLint設定
- **Base**: ESLint推奨ルール + TypeScript ESLint
- **Astro**: eslint-plugin-astroの推奨設定
- **アクセシビリティ**: jsx-a11y-strictルール適用
- **パーサー**: Astroファイル用の専用パーサー設定

## Prettier設定
- **タブ幅**: 2スペース
- **セミコロン**: なし（semi: false）
- **クォート**: シングルクォート
- **行の長さ**: 100文字
- **プラグイン**: 
  - prettier-plugin-astro
  - prettier-plugin-tailwindcss

## Stylelint設定
- **Base**: stylelint-config-standard
- **順序**: stylelint-config-recess-order（CSSプロパティの順序統一）

## 命名規約
- **ファイル名**: kebab-case（例: blog-card.astro）
- **コンポーネント**: PascalCase（例: BlogCard.astro）
- **変数/関数**: camelCase
- **CSS クラス**: Tailwind CSS ユーティリティクラス優先

## ディレクトリ構造規約
```
src/
├── components/     # 再利用可能なコンポーネント
├── layouts/        # ページレイアウト
├── pages/          # ルーティング用ページ
├── content/        # MDXコンテンツ（blog/）
├── lib/            # ユーティリティ関数
├── scripts/        # クライアントサイドスクリプト
├── styles/         # グローバルスタイル
└── assets/         # 静的アセット
```

## TypeScript設定
- **strict**: 有効
- **ESNext**: 最新のECMAScript機能使用
- **Node.js**: v22をターゲット

## コンテンツ規約
- **ブログ記事**: MDX形式、年/月ディレクトリ構造
- **フロントマター**: title, description, category, date必須
- **ファイル名**: YYMMDD-slug.mdx形式