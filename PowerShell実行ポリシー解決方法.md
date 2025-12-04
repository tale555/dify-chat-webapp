# PowerShell実行ポリシーエラー解決方法

## エラーの原因

PowerShellの実行ポリシー（Execution Policy）が厳しすぎて、`npm.ps1`スクリプトの実行がブロックされています。

エラーメッセージ：
- `このシステムではスクリプトの実行が無効になっているため、ファイル C:\Program Files\nodejs\npm.ps1 を読み込むことができません。`

## 解決方法

### 方法1: 実行ポリシーを変更（推奨）

**管理者権限でPowerShellを開いて以下を実行：**

1. **PowerShellを管理者として実行：**
   - Windowsキーを押す
   - 「PowerShell」と入力
   - 「Windows PowerShell」を右クリック
   - 「管理者として実行」を選択

2. **実行ポリシーを確認：**
   ```powershell
   Get-ExecutionPolicy
   ```

3. **実行ポリシーを変更：**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   
   - 確認メッセージが出たら「Y」を入力してEnter

4. **変更を確認：**
   ```powershell
   Get-ExecutionPolicy
   ```
   - `RemoteSigned` と表示されればOK

5. **通常のPowerShellで再度試す：**
   ```powershell
   cd project-bolt-sb1-pcvnpemp/project
   npm install
   ```

### 方法2: npm.cmdを直接使用（一時的な解決策）

実行ポリシーを変更したくない場合：

```powershell
cd project-bolt-sb1-pcvnpemp/project
& "C:\Program Files\nodejs\npm.cmd" install
```

ただし、この方法では`npm`コマンドが直接使えないため、毎回完全なパスを入力する必要があります。

### 方法3: 実行ポリシーを一時的に変更（現在のセッションのみ）

現在のPowerShellセッションのみで有効：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm install
```

## 実行ポリシーの説明

- **Restricted**: すべてのスクリプトの実行を禁止（デフォルト）
- **RemoteSigned**: ローカルのスクリプトは実行可能、リモートのスクリプトは署名が必要（推奨）
- **Unrestricted**: すべてのスクリプトを実行可能（セキュリティリスクあり）

## 推奨される手順

1. **方法1で実行ポリシーを変更**（一度設定すれば、今後も有効）
2. **通常のPowerShellで`npm install`を実行**

## トラブルシューティング

### 管理者権限で実行できない場合

1. **現在のユーザーのみに適用：**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   - 管理者権限は不要

### それでもエラーが出る場合

1. **コマンドプロンプト（cmd.exe）を使用：**
   - Windowsキー + R → `cmd` → Enter
   - コマンドプロンプトでは実行ポリシーの制限はありません
   ```cmd
   cd project-bolt-sb1-pcvnpemp\project
   npm install
   ```

