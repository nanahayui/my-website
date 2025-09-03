# プロジェクト構造とアーキテクチャ

## ディレクトリ構造
```
my-website/
├── astro.config.mjs          # Astro設定ファイル
├── package.json              # Node.js依存関係管理
├── tsconfig.json             # TypeScript設定
├── tailwind.config.mjs       # Tailwind CSS設定
├── eslint.config.js          # ESLint設定
├── .prettierrc.cjs           # Prettier設定
├── .stylelintrc.cjs          # Stylelint設定
├── public/                   # 静的アセット
│   ├── favicon.svg
│   ├── grass.jpg
│   └── ogp.png
└── src/
    ├── env.d.ts              # 環境型定義
    ├── assets/               # ビルド時処理されるアセット
    ├── components/           # 再利用可能コンポーネント
    │   ├── BlogCard.astro
    │   ├── Container.astro
    │   ├── Footer.astro
    │   ├── FormattedDate.astro
    │   ├── Header.astro
    │   ├── Metadata.astro
    │   ├── Prose.astro
    │   └── TableOfContents.astro
    ├── content/              # コンテンツコレクション
    │   ├── config.ts         # コンテンツスキーマ定義
    │   └── blog/             # ブログ記事（MDX）
    │       ├── 2024/
    │       └── 2025/
    ├── layouts/              # ページレイアウト
    │   ├── Layout.astro      # 基本レイアウト
    │   └── LayoutTop.astro   # トップページ用レイアウト
    ├── lib/                  # ユーティリティ関数
    │   └── galleryService.ts # ギャラリー機能のAPI
    ├── pages/                # ルーティング用ページ
    │   ├── index.astro       # トップページ
    │   ├── gallery.astro     # ギャラリーページ
    │   └── blog/
    │       ├── [...slug].astro      # 動的ブログ記事ページ
    │       └── page/
    │           └── [page].astro     # ページネーション
    ├── scripts/              # クライアントサイドスクリプト
    │   └── photoswipeInit.ts # PhotoSwipe初期化
    └── styles/               # グローバルスタイル
        ├── global.css
        ├── remark-link-card.css
        └── table-of-contents.css
```

## アーキテクチャパターン

### 1. ファイルベースルーティング
- `src/pages/`内のファイル構造がURLに対応
- 動的ルート（[...slug].astro）でブログ記事表示
- ページネーション機能

### 2. コンテンツコレクション
- `src/content/`でMarkdown/MDXコンテンツを管理
- TypeScriptスキーマによる型安全なコンテンツ管理
- フロントマターの型チェック

### 3. コンポーネント指向設計
- 再利用可能なAstroコンポーネント
- レイアウトコンポーネントによるページ構造統一
- props型定義による型安全性

### 4. ユーティリティファースト（Tailwind CSS）
- インラインスタイリング中心
- レスポンシブデザイン対応
- ダークモード対応

### 5. 静的サイト生成（SSG）
- ビルド時にHTMLを事前生成
- 高いパフォーマンス
- CDN配信に最適化

## 主要機能

### ブログ機能
- MDX形式での記事作成
- フロントマターによるメタデータ管理
- 自動目次生成（tocbot）
- リンクカード機能（remark-link-card）
- 日付フォーマット（dayjs）

### ギャラリー機能
- Cloudflare R2との連携
- 画像サイズ自動取得（probe-image-size）
- PhotoSwipeによる画像ビューワー

### SEO対応
- メタデータコンポーネント
- OGP対応
- 構造化データ対応可能な設計