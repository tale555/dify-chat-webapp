# Dify Chat Webアプリ

Difyで作成したチャットボットと連携するWebアプリケーションです。

## 機能

- Dify APIと連携したチャットボット
- 会話履歴の管理
- リアルタイムでのメッセージ送受信
- エラーハンドリング

## セットアップ手順

### 0. 前提条件: Node.jsのインストール

このプロジェクトを実行するには、**Node.js**と**npm**が必要です。

**Node.jsがインストールされていない場合:**

1. [Node.js公式サイト](https://nodejs.org/ja/)にアクセス
2. **LTS版（推奨）**の「ダウンロード」ボタンをクリック
3. ダウンロードした`.msi`ファイルを実行してインストール
   - インストール中、「Add to PATH」がONになっていることを確認
4. **インストール後、すべてのターミナルを閉じて、新しいターミナルを開く**
5. インストール確認：
   ```bash
   node --version
   npm --version
   ```

**詳細な手順は `SETUP_NODEJS.md` を参照してください。**

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

#### 2-1. 環境変数ファイルの作成

プロジェクトルート（`project`フォルダ）で、以下のコマンドを実行してください：

**Windowsの場合:**
```bash
copy env.example.txt .env
```

**Mac/Linuxの場合:**
```bash
cp env.example.txt .env
```

#### 2-2. Dify API設定の取得

##### Dify API Keyの取得

1. [Dify](https://dify.ai/)にアクセスしてログイン
2. 右上の「Settings」→「API Keys」を開く
3. 「Create API Key」をクリック
4. 名前を入力（例: "Web App API Key"）
5. 生成されたAPI Keyをコピー（`app-`で始まる文字列）

##### Dify App IDの取得（詳しい手順）

**ステップ1: アプリを選択**
1. [Dify](https://dify.ai/)にログイン
2. ダッシュボードから、使用するアプリ（チャットボット）をクリック
   - 例: 「古着画像解析ボット」などのアプリ名をクリック

**ステップ2: API アクセスページを開く**
1. アプリのページが開いたら、**左サイドバー**を確認
2. 左サイドバーに以下のメニューが表示されます：
   - オーケストレート（またはオーケストレーション）
   - **API アクセス** ← ここをクリック
   - ログ&注釈
   - 監視
3. **「API アクセス」**をクリック

**ステップ3: App IDを確認・コピー**
1. 「API アクセス」ページが開くと、以下の情報が表示されます：
   - **App ID**: UUID形式の文字列（例: `cb5a1cbf-b6bd-47a7-9b8f-9b7ee9d21dc0`）
   - API Key（これは別の設定で使用）
   - API エンドポイント情報
2. **「App ID」**の横にあるコピーボタン（📋アイコン）をクリック、またはApp IDの文字列を選択してコピー
3. コピーしたApp IDを`.env`ファイルの`VITE_DIFY_APP_ID`に貼り付け

**注意事項:**
- App IDは**アプリごとに異なります**
- 複数のアプリを使用する場合は、それぞれのApp IDを取得してください
- App IDは公開しても問題ありませんが、API Keyとは異なり、App ID単体ではAPIにアクセスできません

#### 2-3. 環境変数の設定

作成した`.env`ファイルを開き、以下の値を実際の値に置き換えてください：

```env
VITE_DIFY_API_KEY=ここにAPI Keyを貼り付け
VITE_DIFY_APP_ID=ここにApp IDを貼り付け
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

**重要:**
- `your_dify_api_key_here`の部分を実際のAPI Keyに置き換える
- `your_dify_app_id_here`の部分を実際のApp IDに置き換える
- 値の前後に余分なスペースや改行を入れない
- 引用符（`"`や`'`）は不要

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスして、アプリが正常に動作することを確認してください。

## 使用方法

1. ブラウザでアプリを開く
2. メッセージ入力欄に質問を入力
3. Enterキーを押すか、送信ボタンをクリック
4. AIからの応答が表示されます

## ビルド

本番環境用のビルド:

```bash
npm run build
```

ビルドされたファイルは`dist`フォルダに生成されます。

ビルド結果をプレビューする場合:

```bash
npm run preview
```

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にアクセスしてアカウントを作成（GitHubアカウントでログイン可能）
2. 「New Project」をクリック
3. GitHubリポジトリを選択、またはプロジェクトフォルダをドラッグ&ドロップ
4. プロジェクト設定:
   - **Framework Preset**: Vite
   - **Root Directory**: `project`（プロジェクトフォルダがルートの場合）
5. 環境変数の設定:
   - 「Environment Variables」セクションで以下を追加:
     - `VITE_DIFY_API_KEY`: あなたのDify API Key
     - `VITE_DIFY_APP_ID`: あなたのDify App ID
     - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（カスタムドメインを使用する場合）
6. 「Deploy」をクリック

### Netlifyへのデプロイ

1. [Netlify](https://www.netlify.com/)にアクセスしてアカウントを作成
2. 「Add new site」→「Import an existing project」を選択
3. GitHubリポジトリを選択、またはプロジェクトフォルダをドラッグ&ドロップ
4. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 環境変数の設定:
   - 「Site settings」→「Environment variables」で以下を追加:
     - `VITE_DIFY_API_KEY`: あなたのDify API Key
     - `VITE_DIFY_APP_ID`: あなたのDify App ID
     - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`
6. 「Deploy site」をクリック

### GitHub Pagesへのデプロイ

1. `vite.config.ts`に以下を追加:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // リポジトリ名に置き換え
  // ... 既存の設定
});
```

2. GitHub Actionsを使用する場合、`.github/workflows/deploy.yml`を作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
        env:
          VITE_DIFY_API_KEY: ${{ secrets.VITE_DIFY_API_KEY }}
          VITE_DIFY_APP_ID: ${{ secrets.VITE_DIFY_APP_ID }}
          VITE_DIFY_API_BASE_URL: ${{ secrets.VITE_DIFY_API_BASE_URL }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. GitHubリポジトリの「Settings」→「Secrets」で環境変数を設定

### 静的ホスティング（一般的な手順）

1. 環境変数を設定してビルド:

```bash
export VITE_DIFY_API_KEY=your_api_key
export VITE_DIFY_APP_ID=your_app_id
export VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
npm run build
```

2. `dist`フォルダの内容をホスティングサービスにアップロード

**注意**: 環境変数はビルド時に埋め込まれるため、本番環境では適切なセキュリティ対策を講じてください。

## トラブルシューティング

### エラー: "VITE_DIFY_API_KEY が設定されていません"

- `.env`ファイルが正しく作成されているか確認
- `.env`ファイルがプロジェクトルート（`project`フォルダ）にあるか確認
- 環境変数名が`VITE_`で始まっているか確認
- 開発サーバーを再起動してください（環境変数の変更後は再起動が必要です）

### エラー: "HTTP 401: Unauthorized"

- API Keyが正しく設定されているか確認
- API Keyが有効か確認（Difyダッシュボードで確認）

### エラー: "HTTP 404: Not Found"

- App IDが正しく設定されているか確認
- API Base URLが正しいか確認

## 技術スタック

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Dify API

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

