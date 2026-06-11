# Railway へのデプロイ手順 🚀

このドキュメントでは、掲示板ビューアーを Railway にデプロイする手順を説明します。

## 前提条件

- GitHub アカウント
- Railway アカウント
- このリポジトリへのアクセス権限

## Step 1: Railway アカウント作成

1. https://railway.app にアクセス
2. 「Sign up」をクリック
3. GitHub アカウントでサインアップ
4. メール認証を完了

## Step 2: 新しいプロジェクトを作成

1. Railway ダッシュボードにログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub」を選択
4. GitHub リポジトリ一覧から `bulletin-viewer` を選択

## Step 3: 環境変数を設定（オプション）

Railroad プロジェクト設定から以下の環境変数を追加：

| 変数名 | 値 | 説明 |
|-------|-----|------|
| `PORT` | `3000` | サーバーポート（デフォルト） |
| `NODE_ENV` | `production` | 環境（本番） |
| `CACHE_TTL` | `3600` | キャッシュ有効期間（秒） |

## Step 4: デプロイの確認

1. Railroad ダッシュボードでプロジェクトを確認
2. 「Deployments」タブで最新のデプロイを確認
3. ログに `Listening on http://localhost:3000` が表示されていれば成功

## Step 5: ドメイン確認

1. Railroad ダッシュボードの「Settings」タブを開く
2. 「Domains」セクションで自動生成されたドメイン URL を確認
3. 例：`https://bulletin-viewer-production.up.railway.app`
4. ブラウザでアクセスして動作確認

## GitHub Actions 自動デプロイ設定（オプション）

### Step 1: Railroad API トークン取得

1. Railroad ダッシュボードで account icon →「Settings」をクリック
2. 「Account」→「API Tokens」セクションに移動
3. 「New Token」をクリック
4. トークンをコピー

### Step 2: GitHub シークレット登録

1. GitHub リポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 「New repository secret」をクリック
3. 名前：`RAILWAY_TOKEN`
4. 値：上記でコピーした Railroad API トークン
5. 「Add secret」をクリック

### Step 3: 自動デプロイの確認

`.github/workflows/deploy.yml` が既に設定されているため：
- `master` または `main` ブランチにプッシュすると
- GitHub Actions が自動的にビルドしてデプロイします
- GitHub リポジトリの「Actions」タブで実行状況が確認できます

## トラブルシューティング

### デプロイが失敗する

**ビルドエラーが表示される場合:**
1. ローカルで `npm install && npm run build` を実行
2. エラーが発生しないか確認
3. 修正後、GitHub にプッシュ

**Railway ログを確認:**
1. Railroad ダッシュボードでプロジェクトを開く
2. 「Logs」タブでビルド・実行ログを確認

### サイトにアクセスできない

**ポート設定を確認:**
```bash
# サーバーがポート 3000 で起動しているか確認
curl https://your-railway-url/api/health
```

**環境変数を確認:**
1. Railroad ダッシュボード → プロジェクト → 「Variables」
2. 必要な環境変数が設定されているか確認

### API が 404 を返す

**フロントエンドのビルド確認:**
```bash
# ローカルでビルド実行
npm run build

# client/dist が生成されているか確認
ls client/dist/
```

## ドメインのカスタマイズ（有料機能）

Railroad Free Tier では自動生成ドメインのみ利用可能です。

カスタムドメインを使用するには：
1. Railroad をアップグレード（有料プラン）
2. プロジェクト設定 → Domains → Add Custom Domain
3. 取得したドメインを設定
4. DNS レコードを設定

詳細：https://docs.railway.app/develop/domains

## 本番環境での注意

### セキュリティ

- ✅ HTTPS 自動対応（Railroad が自動で HTTPS 化）
- ⚠️ スクレイピング対象サイトの利用規約を確認
- ⚠️ Rate Limiting を実装検討（robots.txt 遵守）

### パフォーマンス

- メモリ使用量：Free Tier 512MB
- CPU：共有リソース
- データベース：不要（メモリキャッシュのみ）

### コスト

Railroad Free Tier：
- 最初の $5/月まで無料
- その後：従量課金制

詳細：https://railway.app/pricing

## アップデート手順

新しい変更をデプロイするには：

```bash
# ローカルで開発
git add .
git commit -m "Your changes"

# GitHub にプッシュ（自動デプロイ開始）
git push origin main
```

GitHub Actions が自動的にビルド・デプロイを実行します。

## よくある質問

**Q: スクレイピング先を変更したい**
A: `scraper.js` を修正後、コミット・プッシュしてください。自動デプロイされます。

**Q: API キーを設定したい**
A: Railroad の環境変数を追加後、`scraper.js` や `server.js` で `process.env.VARIABLE_NAME` で参照できます。

**Q: ログを確認したい**
A: Railroad ダッシュボード → プロジェクト → 「Logs」タブで確認できます。

## 参考ドキュメント

- Railroad 公式ドキュメント：https://docs.railway.app/
- Node.js デプロイガイド：https://docs.railway.app/deploy/nodejs
- GitHub Actions 連携：https://docs.railway.app/guides/github-actions

---

サポートが必要な場合は、GitHub Issues で報告してください。
