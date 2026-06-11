# 掲示板ビューアー 🚀

Web ベースの掲示板スレッド ビューアー。見やすいインターフェース、ホバーレスプレビュー、CSV エクスポート機能を備えています。

## ✨ 主な機能

- 📌 **スレッド表示** - 掲示板スレッドを見やすく表示
- 🔍 **ホバープレビュー** - `>>番号` にマウスオーバーで該当レスをポップアップ表示
- 📥 **CSV エクスポート** - スレッド全体をダウンロード（レス番号、日時、投稿者、内容）
- 📱 **レスポンシブ** - PC、タブレット、モバイル対応
- ⚡ **高速** - メモリキャッシュでスレッドデータを高速化

## 🛠 技術スタック

### バックエンド
- **Node.js** - ランタイム
- **Express** - Web フレームワーク
- **Cheerio** - HTML パース / スクレイピング
- **Axios** - HTTP クライアント
- **CORS** - クロスオリジンリクエスト対応

### フロントエンド
- **React** - UI ライブラリ
- **Vite** - ビルドツール

### デプロイ
- **Railway** - クラウドホスティング
- **GitHub Actions** - CI/CD パイプライン

## 🚀 クイックスタート

### ローカル開発

#### 前提条件
- Node.js 16+ 
- npm または yarn

#### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/mkt918/bulletin-viewer.git
cd bulletin-viewer

# バックエンド依存パッケージをインストール
npm install

# フロントエンド依存パッケージをインストール
cd client && npm install && cd ..
```

#### 開発サーバーを起動

**ターミナル 1 - バックエンド（ポート 3001）**
```bash
npm run dev
```

**ターミナル 2 - フロントエンド（ポート 5173）**
```bash
cd client
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

#### 本番ビルド

```bash
npm run build
npm start
```

サーバーが http://localhost:3001 で起動します。

## 📡 API エンドポイント

### GET `/api/thread/:id`
スレッドデータを JSON で取得

**パラメータ:**
- `id` (string): スレッド ID

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "13309333",
    "title": "スレッドタイトル",
    "posts": [
      {
        "num": "1",
        "date": "2024-01-01 12:34:56",
        "author": "名前",
        "content": "投稿内容"
      }
    ],
    "postCount": 100,
    "scrapedAt": "2024-01-01T12:34:56.000Z"
  },
  "cached": false
}
```

### GET `/api/download/:id`
スレッドを CSV ファイルでダウンロード

**レスポンス:**
- `Content-Type`: text/csv
- `Content-Disposition`: attachment; filename="thread_{id}.csv"

### GET `/api/health`
ヘルスチェック

## 🌐 デプロイ（Railway）

### 自動デプロイ設定

1. **Railroad アカウント作成**
   - https://railway.app にアクセス
   - GitHub アカウントでサインアップ

2. **プロジェクト作成**
   - Railway ダッシュボードで「New Project」をクリック
   - 「Deploy from GitHub」を選択
   - このリポジトリ（`bulletin-viewer`）を選択

3. **環境変数設定**
   Railroad プロジェクト設定で以下の環境変数を追加（オプション）：
   - `PORT`: 3000（デフォルト）
   - `NODE_ENV`: production
   - `CACHE_TTL`: 3600（キャッシュ時間（秒））

4. **GitHub Actions シークレット設定**
   - GitHub リポジトリの「Settings」→「Secrets」
   - `RAILWAY_TOKEN` を追加
     - Railroad でアカウント設定から API トークンを取得
     - 値をコピーしてシークレットに追加

5. **デプロイ実行**
   ```bash
   git push origin main  # master または main ブランチへプッシュ
   ```
   - GitHub Actions が自動的にビルド・デプロイを開始
   - Railroad ダッシュボードでデプロイ状況を確認

6. **ライブサイト確認**
   - Railroad ダッシュボードでドメインを確認
   - 例：`https://bulletin-viewer-production.up.railway.app`

## 📝 ファイル構成

```
bulletin-viewer/
├── server.js                    # Express サーバー
├── scraper.js                   # スクレイピング関数
├── csv-generator.js             # CSV 生成ロジック
├── package.json                 # バックエンド依存パッケージ
├── .env                         # 環境変数（.env.example を参考）
├── Procfile                     # Heroku デプロイ設定
├── railway.json                 # Railway デプロイ設定
├── README.md                    # このファイル
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions ワークフロー
├── client/                      # React フロントエンド
│   ├── src/
│   │   ├── App.jsx              # メインコンポーネント
│   │   ├── components/          # React コンポーネント
│   │   │   ├── ThreadViewer.jsx
│   │   │   ├── PostItem.jsx
│   │   │   └── AnchorPopup.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── dist/                    # ビルド出力（本番環境で生成）
└── node_modules/                # 依存パッケージ
```

## 🔧 スクレイピング設定

`scraper.js` で対象サイトの HTML 構造に合わせてセレクターを調整してください。

**現在の対象サイト:**
- bakusai.com（バクサイ掲示板）

**セレクター例:**
```javascript
// レス番号
const postNum = $post.find('[class*="num"]').text().trim();

// 日時
const dateStr = $post.find('[class*="date"]').text().trim();

// 投稿者
const author = $post.find('[class*="name"]').text().trim();

// 本文
const content = $post.find('[class*="message"]').text().trim();
```

実際のサイト構造に合わせて修正してください。

## 🛡️ セキュリティ

- ✅ XSS 対策：HTML エスケープ
- ✅ CORS 対応
- ⚠️ Rate Limiting：今後追加予定
- ⚠️ 認証：今後追加予定

## 📦 環境変数

`.env` ファイルで以下を設定できます：

```env
PORT=3001                    # サーバーポート
NODE_ENV=development         # 環境（development/production）
CACHE_TTL=3600              # キャッシュ有効期間（秒）
```

## 🐛 トラブルシューティング

### "Cannot find module" エラー
```bash
npm install
cd client && npm install
```

### ポート 3001 が既に使用されている
```bash
# 別のポート指定
PORT=3002 npm start
```

### スクレイピングが失敗する
- サイトのセレクターが変更された可能性があります
- `scraper.js` のセレクターを確認・調整してください

### フロントエンドが表示されない（Railway デプロイ時）
- `npm run build` が正常に実行されているか確認
- `client/dist` フォルダが生成されているか確認

## 📈 パフォーマンス最適化

- **メモリキャッシュ** - 同じスレッドへのリクエストを 1 時間キャッシュ
- **静的ファイル配信** - フロントエンドを Express で配信
- **Gzip 圧縮** - 自動圧縮（本番環境）

## 🚀 今後の拡張案

- [ ] ページネーション
- [ ] キーワード検索・フィルタ機能
- [ ] ダークモード
- [ ] マルチスレッド管理
- [ ] ユーザー認証
- [ ] データベース永続化
- [ ] レート制限
- [ ] ログ機能

## 📄 ライセンス

ISC

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

## 📞 サポート

問題が発生した場合は、GitHub Issues で報告してください。

---

**Repository:** https://github.com/mkt918/bulletin-viewer  
**Author:** Claude  
**Created:** 2026-06-12
