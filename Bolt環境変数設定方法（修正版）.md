# Boltでの環境変数設定方法（修正版）

## 環境変数の設定場所

Boltでは、環境変数は**「Secrets」**という名前で管理されています。

### 設定手順

1. **左サイドバーの「Secrets」をクリック**
   - 「Project Settings」セクションの中に「Secrets」があります
   - データベースや認証の下あたりにあります

2. **「Add Secret」または「New Secret」ボタンをクリック**

3. **以下の環境変数を追加：**

   **Secret 1:**
   - **Name**: `VITE_DIFY_API_KEY`
   - **Value**: あなたのDify API Key

   **Secret 2:**
   - **Name**: `VITE_DIFY_APP_ID`
   - **Value**: あなたのDify App ID

   **Secret 3:**
   - **Name**: `VITE_DIFY_API_BASE_URL`
   - **Value**: `https://api.dify.ai/v1`

4. **各Secretを保存**

## 代替方法: .envファイルを作成

もし「Secrets」が見つからない場合、プロジェクトのルートに`.env`ファイルを作成してください：

1. **プロジェクトのルートフォルダを開く**
2. **新しいファイルを作成**（ファイル名: `.env`）
3. **以下の内容を記述：**

```
VITE_DIFY_API_KEY=あなたのDify API Key
VITE_DIFY_APP_ID=あなたのDify App ID
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

4. **ファイルを保存**

## 設定後の確認

環境変数を設定した後：

1. **アプリケーションを再起動**（必要に応じて）
2. **ブラウザのコンソール（F12）で確認：**
   ```javascript
   console.log(import.meta.env.VITE_DIFY_API_KEY);
   console.log(import.meta.env.VITE_DIFY_APP_ID);
   ```
3. 値が表示されれば設定成功

## 重要な注意点

### バックエンドサーバーについて

現在の実装では、**バックエンドサーバー（`server.js`）が必要**です。

Boltは主にフロントエンド用のため、以下のいずれかが必要です：

1. **バックエンドサーバーを別途デプロイ**
   - Render、Vercel、Railwayなどにデプロイ
   - バックエンドサーバーのURLを環境変数で設定

2. **フロントエンドのみをBoltで動作させる**
   - バックエンドサーバーを別途デプロイ
   - フロントエンドのAPI呼び出し先を変更

---

**左サイドバーの「Secrets」をクリックして、環境変数を設定してください！**

