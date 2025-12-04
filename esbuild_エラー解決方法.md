# esbuild インストールエラー解決方法

## エラーの原因

`esbuild`のインストール中に`node install.js`が失敗しています。これは、npmが内部で`node`コマンドを呼び出そうとしているが、PATH環境変数が正しく設定されていないため、`node`が見つからないことが原因です。

## 解決方法

### 方法1: PCを再起動（最も確実）

PATH環境変数の変更を完全に反映するには、PCの再起動が必要です。

1. **PCを再起動**
2. 再起動後、新しいターミナル（PowerShell）を開く
3. 以下を実行：
   ```powershell
   cd project-bolt-sb1-pcvnpemp/project
   npm install
   ```

### 方法2: 環境変数をPowerShellで一時的に設定

PCを再起動できない場合の一時的な解決策：

```powershell
cd project-bolt-sb1-pcvnpemp/project

# PATH環境変数を更新
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# nodeとnpmが認識されるか確認
node --version
npm --version

# 再度インストール
npm install
```

### 方法3: 管理者権限で実行

1. **PowerShellを管理者として実行**
2. 以下を実行：
   ```powershell
   cd "C:\Users\mhero\OneDrive\デスクトップ\cursor練習\project-bolt-sb1-pcvnpemp\project"
   
   # PATHを更新
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   
   # node_modulesを削除（存在する場合）
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   
   # 再度インストール
   npm install
   ```

### 方法4: npmの設定でnodeのパスを明示的に指定

```powershell
cd project-bolt-sb1-pcvnpemp/project

# npmの設定でnodeのパスを指定
npm config set node "C:\Program Files\nodejs\node.exe"

# 再度インストール
npm install
```

## 推奨される手順

1. **まず方法2を試す**（PATHを一時的に更新）
2. **それでもダメな場合は、方法1でPCを再起動**
3. **再起動後、`npm install`を実行**

## 成功の確認

インストールが成功すると、以下のようなメッセージが表示されます：

```
added XXX packages, and audited XXX packages in XXs
```

エラーメッセージが表示されず、最後にプロンプトが戻れば成功です。

