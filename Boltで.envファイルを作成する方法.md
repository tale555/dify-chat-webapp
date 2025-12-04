# Boltで.envファイルを作成する方法

## 方法1: Boltのチャット機能を使用（最も簡単）

1. **Boltの左下にあるチャット入力欄を開く**
   - 「How can Bolt help you today?」と表示されている入力欄

2. **以下のコマンドを入力：**

```
Create a new file called .env in the root directory with the following content:

VITE_DIFY_API_KEY=your-api-key-here
VITE_DIFY_APP_ID=your-app-id-here
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

または、日本語で：

```
ルートディレクトリに.envファイルを作成して、以下の内容を記述してください：

VITE_DIFY_API_KEY=あなたのAPIキー
VITE_DIFY_APP_ID=あなたのApp ID
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

3. **Boltがファイルを作成してくれます**

4. **作成後、実際のAPIキーとApp IDに置き換えてください**

## 方法2: ファイルツリーを表示する

1. **Boltの左側を確認**
   - ファイルツリーが表示されていない場合、左側の端をドラッグして広げる
   - または、左側のアイコンをクリックしてファイルツリーを表示

2. **プロジェクトのルートフォルダ（`dify-chat-webapp`）を右クリック**

3. **「New File」または「新しいファイル」を選択**

4. **ファイル名を`.env`と入力**

5. **以下の内容を記述：**

```
VITE_DIFY_API_KEY=あなたのAPIキー
VITE_DIFY_APP_ID=あなたのApp ID
VITE_DIFY_API_BASE_URL=https://api.dify.ai/v1
```

6. **保存（Ctrl+S または Cmd+S）**

## 方法3: 既存のファイルを参考にする

1. **既存のファイル（例：`package.json`）を開く**

2. **ファイル名を変更して`.env`にする**

3. **内容を削除して、環境変数を記述**

## 重要な注意点

### 実際の値を設定する

`.env`ファイルを作成したら、以下の値を実際の値に置き換えてください：

- `VITE_DIFY_API_KEY`: DifyのAPI Key（Dify > Settings > API Keysで確認）
- `VITE_DIFY_APP_ID`: DifyのApp ID（Dify > アプリ > 設定 > APIで確認）
- `VITE_DIFY_API_BASE_URL`: `https://api.dify.ai/v1`（デフォルトのまま）

### アプリケーションの再起動

環境変数を設定した後、アプリケーションを再起動してください：

1. 実行中のアプリケーションを停止
2. `npm run dev`を再度実行

---

**最も簡単な方法は、Boltのチャット機能を使って「.envファイルを作成して」と依頼することです！**

