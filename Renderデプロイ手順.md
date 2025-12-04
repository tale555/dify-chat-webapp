# Renderデプロイ手順

## ステップ1: GitHubに変更をプッシュ

機能追加した変更をGitHubにプッシュします。

### ターミナルで以下を実行：

```powershell
cd project-bolt-sb1-pcvnpemp/project

# 変更を確認
git status

# すべての変更を追加
git add .

# コミット
git commit -m "機能追加: 会話履歴管理、メッセージ操作、エクスポート機能"

# GitHubにプッシュ
git push origin main
```

## ステップ2: Renderでデプロイ

### 2-1. Renderアカウントの作成・ログイン

1. [Render](https://render.com/)にアクセス
2. アカウントを作成（GitHubアカウントでログイン可能）

### 2-2. バックエンドサーバーのデプロイ

現在の実装では、バックエンドサーバー（`server.js`）が必要です。

#### 新しいWebサービスを作成

1. Renderのダッシュボードで「New +」→「Web Service」をクリック
2. GitHubリポジトリを選択（`tale555/dify-chat-webapp`）
3. 設定を入力：
   - **Name**: `dify-chat-backend`（任意の名前）
   - **Region**: 最寄りのリージョンを選択
   - **Branch**: `main`
   - **Root Directory**: `project`（プロジェクトのルートディレクトリ）
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**を追加：
   - `VITE_DIFY_API_KEY`: あなたのDify API Key
   - `VITE_DIFY_APP_ID`: あなたのDify App ID
   - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（デフォルト）
   - `NODE_ENV`: `production`
5. 「Create Web Service」をクリック

### 2-3. フロントエンドのデプロイ

#### 静的サイトとしてデプロイ

1. Renderのダッシュボードで「New +」→「Static Site」をクリック
2. GitHubリポジトリを選択（`tale555/dify-chat-webapp`）
3. 設定を入力：
   - **Name**: `dify-chat-frontend`（任意の名前）
   - **Branch**: `main`
   - **Root Directory**: `project`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**を追加：
   - `VITE_DIFY_API_KEY`: あなたのDify API Key
   - `VITE_DIFY_APP_ID`: あなたのDify App ID
   - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（デフォルト）
   - **重要**: `VITE_API_BASE_URL`: バックエンドサーバーのURL（例: `https://dify-chat-backend.onrender.com/api`）
5. 「Create Static Site」をクリック

### 2-4. フロントエンドのAPI接続先を変更

フロントエンドがバックエンドサーバーに接続できるように、`chatApi.ts`を確認します。

現在の実装では、`VITE_API_BASE_URL`環境変数を使用しているはずです。もし使用していない場合は、修正が必要です。

## ステップ3: CORS設定の確認

バックエンドサーバーのCORS設定を、フロントエンドのURLに合わせて更新する必要があります。

`server.js`のCORS設定を確認：

```javascript
app.use(cors({
  origin: 'https://dify-chat-frontend.onrender.com', // フロントエンドのURL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

または、環境変数で設定：

```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## ステップ4: デプロイ後の確認

1. バックエンドサーバーが起動しているか確認
2. フロントエンドがビルドされているか確認
3. ブラウザでフロントエンドのURLにアクセス
4. 動作確認

## トラブルシューティング

### バックエンドが起動しない

- ログを確認してエラーを特定
- 環境変数が正しく設定されているか確認
- `package.json`に必要な依存関係が含まれているか確認

### CORSエラー

- バックエンドのCORS設定でフロントエンドのURLを許可
- 環境変数`FRONTEND_URL`を設定

### 環境変数が読み込まれない

- Renderの環境変数設定を確認
- 変数名が正しいか確認（`VITE_`で始まる必要がある）

---

**まず、GitHubに変更をプッシュしてから、Renderでデプロイしてください！**

