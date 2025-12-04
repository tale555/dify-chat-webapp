# GitHubにプッシュする手順

## ステップ1: GitHubリポジトリを作成

1. [GitHub](https://github.com/)にログイン
2. 右上の「+」アイコンをクリック → 「New repository」を選択
3. リポジトリ情報を入力：
   - **Repository name**: `dify-chat-webapp`（任意の名前）
   - **Description**: `Dify Chat Web Application`（任意）
   - **Public** または **Private** を選択
   - **「Add a README file」はチェックしない**（既にREADME.mdがあるため）
   - **「Add .gitignore」はチェックしない**（既に.gitignoreがあるため）
4. 「Create repository」をクリック

## ステップ2: Gitリポジトリを初期化

ターミナル（PowerShell）で以下を実行：

```powershell
cd project-bolt-sb1-pcvnpemp/project

# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: Dify Chat Web App with image upload"
```

## ステップ3: GitHubリポジトリをリモートとして追加

GitHubで作成したリポジトリのページを開き、以下のいずれかのURLをコピー：

- **HTTPS**: `https://github.com/あなたのユーザー名/dify-chat-webapp.git`
- **SSH**: `git@github.com:あなたのユーザー名/dify-chat-webapp.git`

ターミナルで以下を実行（URLを実際のものに置き換える）：

```powershell
# リモートリポジトリを追加
git remote add origin https://github.com/あなたのユーザー名/dify-chat-webapp.git

# ブランチ名をmainに設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

## ステップ4: 認証

初回プッシュ時、GitHubの認証情報を求められる場合があります：

- **Personal Access Token**を使用する場合：
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. 「Generate new token」をクリック
  3. スコープで「repo」にチェック
  4. トークンを生成してコピー
  5. パスワードの代わりにトークンを入力

- **GitHub CLI**を使用する場合：
  ```powershell
  gh auth login
  ```

## ステップ5: Boltでインポート

1. [Bolt](https://bolt.new/)にアクセス
2. 「Import from GitHub」をクリック
3. 作成したリポジトリ（`dify-chat-webapp`）を選択
4. インポート完了

## トラブルシューティング

### エラー: "remote origin already exists"

既にリモートが設定されている場合：

```powershell
# 既存のリモートを削除
git remote remove origin

# 再度追加
git remote add origin https://github.com/あなたのユーザー名/dify-chat-webapp.git
```

### エラー: "failed to push some refs"

GitHubリポジトリに既にファイルがある場合：

```powershell
# リモートの変更を取得
git pull origin main --allow-unrelated-histories

# 再度プッシュ
git push -u origin main
```

### エラー: 認証エラー

Personal Access Tokenを使用するか、GitHub CLIで認証：

```powershell
gh auth login
```

## 注意事項

- `.env`ファイルは`.gitignore`に含まれているため、GitHubにプッシュされません（安全です）
- `node_modules`も除外されているため、GitHubにプッシュされません
- 環境変数は、Bolt上で設定する必要があります

