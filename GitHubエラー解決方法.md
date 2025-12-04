# GitHubプッシュエラー解決方法

## エラーの内容

- `error: remote origin already exists.` → 既にoriginが設定されている
- `remote: Repository not found.` → リポジトリが見つからない（URLが間違っている）

## 解決方法

### ステップ1: 既存のリモートを確認

ターミナルで以下を実行：

```powershell
cd project-bolt-sb1-pcvnpemp/project
git remote -v
```

これで、現在設定されているリモートURLが表示されます。

### ステップ2: 既存のリモートを削除

```powershell
git remote remove origin
```

### ステップ3: 正しいURLでリモートを追加

GitHubで作成したリポジトリのURLを確認して、以下を実行（URLを実際のものに置き換える）：

```powershell
git remote add origin https://github.com/tale555/dify-chat-webapp.git
```

**注意**: `tale555`の部分をあなたのGitHubユーザー名に置き換えてください。

### ステップ4: リモートURLを確認

```powershell
git remote -v
```

正しいURLが表示されることを確認してください。

### ステップ5: 再度プッシュ

```powershell
git push -u origin main
```

## リポジトリが存在しない場合

GitHubでリポジトリが作成されていない場合：

1. [GitHub](https://github.com/)にアクセス
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `dify-chat-webapp`）
4. 「Create repository」をクリック
5. 上記のステップ2から再度実行

## 認証エラーの場合

`remote: Support for password authentication was removed` というエラーが出る場合：

1. **Personal Access Token**を使用：
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 「Generate new token」をクリック
   - スコープで「repo」にチェック
   - トークンを生成してコピー
   - パスワードの代わりにトークンを入力

2. **GitHub CLI**を使用：
   ```powershell
   gh auth login
   ```

