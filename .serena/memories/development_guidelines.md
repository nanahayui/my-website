# 開発ガイドラインと設計パターン

## デザインパターン

### 1. コンポーネント設計原則
- **単一責任の原則**: 各コンポーネントは1つの明確な責任を持つ
- **再利用性**: 汎用的なコンポーネントは共通化
- **型安全性**: TypeScriptインターフェースでProps定義
- **アクセシビリティ**: ARIA属性の適切な使用

### 2. レイアウトパターン
- **Layout.astro**: 基本的なページレイアウト（ヘッダー、フッター、コンテナ）
- **LayoutTop.astro**: トップページ専用レイアウト
- **Container.astro**: コンテンツ幅制限とセンタリング

### 3. スタイリングパターン
- **Tailwind優先**: ユーティリティクラスを最優先
- **カスタムCSS**: 必要時のみsrc/styles/に配置
- **レスポンシブ**: モバイルファーストアプローチ
- **ダークモード**: dark:プレフィックスで対応

## 開発規約

### ファイル命名規則
- **コンポーネント**: PascalCase.astro（例: BlogCard.astro）
- **ページ**: kebab-case.astro（例: [...slug].astro）
- **スクリプト**: camelCase.ts（例: photoswipeInit.ts）
- **ブログ記事**: YYMMDD-slug.mdx（例: 241006-hello.mdx）

### コンポーネント作成ガイドライン
```astro
---
// TypeScriptインターフェース定義
interface Props {
  title: string
  description?: string  // オプショナルプロパティ
}

const { title, description } = Astro.props
---

<!-- HTMLテンプレート -->
<div class="component-wrapper">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  /* 必要時のみスコープ付きCSS */
</style>
```

### ブログ記事作成ガイドライン
```mdx
---
title: '記事タイトル'
description: '記事の説明文'
category: 'カテゴリ名'
date: 'YYYY-MM-DD'
---

## 見出し
記事内容...
```

## パフォーマンス最適化

### 1. 画像最適化
- WebP形式の使用推奨
- 適切なサイズでの配信
- レスポンシブ画像対応

### 2. バンドル最適化
- 必要最小限のJavaScript
- CSS-in-JSではなくTailwind使用
- 静的サイト生成によるHTMLキャッシュ

### 3. SEO最適化
- メタデータの適切な設定
- セマンティックHTML構造
- パフォーマンススコア重視

## セキュリティ考慮事項

### 1. 依存関係管理
- 定期的な`npm audit`実行
- セキュリティアップデートの適用

### 2. コンテンツセキュリティ
- ユーザー入力の適切なサニタイズ
- XSS対策の実装

## エラーハンドリング

### 1. ビルド時エラー
- TypeScriptコンパイルエラーの解決
- ESLintエラーの修正
- Astroビルドエラーの対処

### 2. ランタイムエラー
- 画像読み込みエラーの処理
- APIエラーのグレースフルハンドリング

## テスト戦略
- ESLintによる静的解析
- TypeScriptによる型チェック
- 手動での機能テスト
- ビルド成功確認