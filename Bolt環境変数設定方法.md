# Boltでの環境変数設定方法

## 環境変数の設定場所

Boltで環境変数を設定する方法はいくつかあります：

### 方法1: プロジェクト設定から設定（推奨）

1. **Boltの右上にある「Settings」アイコン（歯車アイコン）をクリック**
2. または、**「Project Settings」を開く**
3. **「Environment Variables」または「環境変数」セクションを探す**
4. 以下の環境変数を追加：
   - `VITE_DIFY_API_KEY`: あなたのDify API Key
   - `VITE_DIFY_APP_ID`: あなたのDify App ID
   - `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（デフォルト）

### 方法2: .envファイルを作成

1. **プロジェクトのルートに`.env`ファイルを作成**
2. 以下の内容を記述：

```
VITE_DIFY_API_KEY=あなたのDify API Key
VITE_DIFY_APP_ID=あなたのDify App ID
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

3. **ファイルを保存**

### 方法3: Boltのチャットで設定

1. **Boltのチャット（左下の入力欄）で以下を入力：**
   ```
   /env VITE_DIFY_API_KEY=あなたのAPI Key
   /env VITE_DIFY_APP_ID=あなたのApp ID
   ```

## 設定後の確認

環境変数を設定した後：

1. **アプリケーションを再起動**（必要に応じて）
2. **ブラウザのコンソール（F12）で確認：**
   ```javascript
   console.log(import.meta.env.VITE_DIFY_API_KEY);
   console.log(import.meta.env.VITE_DIFY_APP_ID);
   ```
3. 値が表示されれば設定成功

## 注意事項

### バックエンドサーバーについて

現在の実装では、**バックエンドサーバー（`server.js`）が必要**です。

Boltは主にフロントエンド用のため、以下のいずれかが必要です：

1. **バックエンドサーバーを別途デプロイ**
   - Render、Vercel、Railwayなどにデプロイ
   - バックエンドサーバーのURLを環境変数で設定

2. **フロントエンドのみをBoltで動作させる**
   - バックエンドサーバーを別途デプロイ
   - フロントエンドのAPI呼び出し先を変更

### 環境変数の命名規則

- Viteでは、環境変数は`VITE_`で始まる必要があります
- これにより、クライアント側で使用可能になります

## トラブルシューティング

### 環境変数が読み込まれない場合

1. **アプリケーションを再起動**
2. **`.env`ファイルがプロジェクトルートにあるか確認**
3. **環境変数名が`VITE_`で始まっているか確認**

---

**Boltの右上にある「Settings」または「Project Settings」から環境変数を設定してください！**

