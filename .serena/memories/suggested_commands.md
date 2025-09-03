# 開発コマンド一覧

## 基本的な開発コマンド

### 開発サーバー
```bash
npm run dev
# または
npm start
```
- ローカル開発サーバーを起動（通常は localhost:4321）
- ホットリロード対応

### ビルド
```bash
npm run build
```
- 本番用静的サイトをビルド
- 事前にastro checkでTypeScriptチェックを実行
- 出力先: ./dist/

### プレビュー
```bash
npm run preview
```
- ビルドされたサイトをローカルでプレビュー
- 本番環境に近い状態で確認可能

## 品質管理コマンド

### リンティング
```bash
npm run lint          # ESLintでコードチェック
npm run lint:fix      # ESLintで自動修正可能な問題を修正
```

### フォーマッティング
```bash
npx prettier --write .    # Prettierで全ファイルをフォーマット
```

### スタイルリンティング
```bash
npx stylelint "src/**/*.css"    # CSSファイルのリンティング
```

### TypeScriptチェック
```bash
npx astro check    # Astroプロジェクトの型チェック
```

## Astro CLIコマンド
```bash
npm run astro ...              # Astro CLIコマンド実行
npm run astro -- --help       # Astro CLIヘルプ表示
npx astro add <integration>    # インテグレーション追加
```

## パッケージ管理
```bash
npm install                    # 依存関係インストール
npm update                     # パッケージ更新
npm audit                      # セキュリティ監査
```

## Git操作（macOS）
```bash
git status                     # 変更状況確認
git add .                      # 全変更をステージング
git commit -m "message"        # コミット
git push                       # リモートにプッシュ
git pull                       # リモートから取得
```

## システムユーティリティ（macOS）
```bash
ls -la                         # ディレクトリ内容表示
find . -name "*.astro"         # ファイル検索
grep -r "pattern" src/         # パターン検索
cat filename                   # ファイル内容表示
```