# Boltでの環境変数設定方法（.envファイル版）

## 問題

Boltの「Secrets」機能はデータベースが必要ですが、データベースを起動しなくても環境変数を設定できます。

## 解決方法: .envファイルを作成

### ステップ1: プロジェクトのルートフォルダを開く

1. Boltの左側のファイルエクスプローラーを開く
2. プロジェクトのルートフォルダ（`dify-chat-webapp`）を確認

### ステップ2: .envファイルを作成

1. **ファイルエクスプローラーで右クリック** → **「New File」**を選択
2. ファイル名を **`.env`** と入力
3. 以下の内容を記述：

```
VITE_DIFY_API_KEY=あなたのDify_API_Keyをここに貼り付け
VITE_DIFY_APP_ID=あなたのDify_App_IDをここに貼り付け
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

**例：**
```
VITE_DIFY_API_KEY=app-xxxxxxxxxxxxx
VITE_DIFY_APP_ID=your-app-id-here
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

4. **ファイルを保存**（Ctrl+S または Cmd+S）

### ステップ3: アプリケーションを再起動

1. アプリケーションを停止（実行中の場合は停止）
2. 再度起動：`npm run dev`

## 確認方法

環境変数が正しく設定されているか確認：

1. **ブラウザのコンソールを開く**（F12キー）
2. **Consoleタブを選択**
3. **以下のコードを入力：**

```javascript
console.log(import.meta.env.VITE_DIFY_API_KEY);
console.log(import.meta.env.VITE_DIFY_APP_ID);
```

4. 値が表示されれば設定成功

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

### .envファイルの注意点

- `.env`ファイルはGitにコミットしないでください（`.gitignore`に含まれています）
- 機密情報を含むため、公開リポジトリには含めないでください

---

**ファイルエクスプローラーで`.env`ファイルを作成して、環境変数を設定してください！**

