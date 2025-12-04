# CORSエラー解決手順

## 問題

ブラウザから直接Dify APIにアクセスしようとすると、CORS（Cross-Origin Resource Sharing）エラーが発生します。これは、Dify APIがブラウザからの直接アクセスを許可していないためです。

## 解決方法

バックエンドサーバー（プロキシサーバー）を作成して、APIリクエストを中継します。

## セットアップ手順

### ステップ1: 必要なパッケージをインストール

新しいターミナル（PowerShell）で以下を実行：

```powershell
cd project-bolt-sb1-pcvnpemp/project
npm install
```

これで、`express`、`cors`、`dotenv`、`concurrently`がインストールされます。

### ステップ2: バックエンドサーバーを起動

**新しいターミナル（PowerShell）を開いて：**

```powershell
cd project-bolt-sb1-pcvnpemp/project
npm run server
```

サーバーが `http://localhost:3001` で起動します。

### ステップ3: フロントエンドを起動

**別の新しいターミナル（PowerShell）を開いて：**

```powershell
cd project-bolt-sb1-pcvnpemp/project
npm run dev
```

フロントエンドが `http://localhost:5173` で起動します。

### ステップ4: ブラウザで確認

ブラウザで `http://localhost:5173` にアクセスして、動作を確認してください。

## 便利なコマンド

### 両方を同時に起動（推奨）

1つのターミナルで両方を起動する場合：

```powershell
cd project-bolt-sb1-pcvnpemp/project
npm run dev:all
```

これで、バックエンドサーバーとフロントエンドが同時に起動します。

## トラブルシューティング

### エラー: "Cannot find module 'express'"

→ `npm install` を実行してください。

### エラー: "Port 3001 is already in use"

→ 別のアプリケーションがポート3001を使用しています。そのアプリケーションを終了するか、`server.js`の`PORT`を変更してください。

### エラー: "環境変数が設定されていません"

→ `.env`ファイルが正しく設定されているか確認してください。

## 仕組み

1. フロントエンド（ブラウザ） → バックエンドサーバー（localhost:3001）にリクエスト
2. バックエンドサーバー → Dify API（api.dify.ai）にリクエスト
3. Dify API → バックエンドサーバーにレスポンス
4. バックエンドサーバー → フロントエンドにレスポンス

これにより、CORSエラーを回避できます。

