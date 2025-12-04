# Boltへの反映方法

完成したプロジェクトをBolt（bolt.new）に反映する方法です。

## 方法1: GitHub経由でインポート（推奨）

### ステップ1: GitHubリポジトリを作成

1. GitHubにログイン
2. 新しいリポジトリを作成
3. リポジトリ名を入力（例: `dify-chat-webapp`）

### ステップ2: プロジェクトをGitHubにプッシュ

ターミナルで以下を実行：

```powershell
cd project-bolt-sb1-pcvnpemp/project

# Gitリポジトリを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Dify Chat Web App"

# GitHubリポジトリをリモートとして追加
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

# プッシュ
git branch -M main
git push -u origin main
```

### ステップ3: Boltでインポート

1. [Bolt](https://bolt.new/)にアクセス
2. 「Import from GitHub」をクリック
3. 作成したリポジトリを選択
4. インポート完了

## 方法2: ファイルを直接コピー

### 必要なファイル

Boltに反映する際に必要なファイル：

**必須ファイル:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `src/` フォルダ内のすべてのファイル

**オプションファイル:**
- `README.md`
- `.env.example.txt`（環境変数の設定例）

**除外するファイル:**
- `node_modules/`（インストール時に自動生成）
- `.env`（機密情報を含むため）
- `dist/`（ビルド時に自動生成）

### 手順

1. Boltで新しいプロジェクトを作成
2. 上記のファイルをコピー&ペースト
3. 環境変数を設定（Boltの環境変数設定機能を使用）

## 方法3: ZIPファイルとしてエクスポート

### ステップ1: プロジェクトをZIP化

必要なファイルのみを含むZIPファイルを作成：

```powershell
cd project-bolt-sb1-pcvnpemp/project

# node_modulesとdistを除外してZIP化（PowerShell）
Compress-Archive -Path * -DestinationPath ../dify-chat-app.zip -Exclude node_modules,dist,.env
```

### ステップ2: Boltにアップロード

1. Boltで新しいプロジェクトを作成
2. ZIPファイルをアップロード（可能な場合）
3. または、ZIPを展開してファイルをコピー

## 環境変数の設定（Bolt上で）

Boltでプロジェクトを開いた後、環境変数を設定：

1. Boltの設定画面を開く
2. 「Environment Variables」または「環境変数」を選択
3. 以下を追加：
   - `VITE_DIFY_API_KEY`: あなたのDify API Key
   - `VITE_DIFY_APP_ID`: あなたのDify App ID
   - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（デフォルト）

## 注意事項

### Boltで動作させる場合の注意点

1. **バックエンドサーバーが必要**
   - 現在の実装では、バックエンドサーバー（`server.js`）が必要です
   - Boltは主にフロントエンド用なので、バックエンドサーバーを別途デプロイする必要があります

2. **バックエンドサーバーのデプロイ先**
   - Render、Vercel、Railwayなどにバックエンドサーバーをデプロイ
   - または、Boltでフロントエンドのみをホストし、バックエンドは別途管理

3. **CORS設定**
   - バックエンドサーバーのCORS設定で、Boltのドメインを許可する必要があります

## 推奨される方法

**フロントエンドのみをBoltに反映する場合:**
- 方法1（GitHub経由）が最も簡単
- バックエンドサーバーは別途デプロイ

**完全なアプリケーションとして反映する場合:**
- バックエンドサーバーも含めてデプロイ
- Render、Vercel、Railwayなどを使用

---

どの方法で進めますか？

