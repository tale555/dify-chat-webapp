# npm install エラー解決方法

## 発生しているエラー

1. **EPERM エラー**: 権限エラーで `node_modules` フォルダの削除ができない
2. **esbuild インストール失敗**: `node install.js` が失敗している

## 解決方法

### 方法1: node_modulesフォルダを手動で削除（推奨）

1. **ファイルエクスプローラーで以下を開く：**
   ```
   C:\Users\mhero\OneDrive\デスクトップ\cursor練習\project-bolt-sb1-pcvnpemp\project
   ```

2. **`node_modules` フォルダが存在する場合、削除する**
   - 削除できない場合は、エクスプローラーを閉じて再度試す
   - それでも削除できない場合は、PCを再起動してから削除

3. **`package-lock.json` ファイルも削除**（存在する場合）

4. **新しいターミナルで再度実行：**
   ```powershell
   cd project-bolt-sb1-pcvnpemp/project
   & "C:\Program Files\nodejs\npm.cmd" install
   ```

### 方法2: 管理者権限で実行

1. **PowerShellを管理者として実行：**
   - Windowsキーを押す
   - 「PowerShell」と入力
   - 「Windows PowerShell」を右クリック
   - 「管理者として実行」を選択

2. **プロジェクトフォルダに移動：**
   ```powershell
   cd "C:\Users\mhero\OneDrive\デスクトップ\cursor練習\project-bolt-sb1-pcvnpemp\project"
   ```

3. **node_modulesを削除（存在する場合）：**
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   ```

4. **再度インストール：**
   ```powershell
   npm install
   ```

### 方法3: クリーンインストール

1. **プロジェクトフォルダで以下を実行：**
   ```powershell
   cd project-bolt-sb1-pcvnpemp/project
   
   # node_modulesとpackage-lock.jsonを削除
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   
   # キャッシュをクリア
   & "C:\Program Files\nodejs\npm.cmd" cache clean --force
   
   # 再度インストール
   & "C:\Program Files\nodejs\npm.cmd" install
   ```

## 成功の確認

インストールが成功すると、以下のようなメッセージが表示されます：

```
added XXX packages, and audited XXX packages in XXs
```

エラーメッセージが表示されず、最後にプロンプトが戻れば成功です。

## トラブルシューティング

### それでもエラーが出る場合

1. **PCを再起動**してから再度試す
2. **ウイルス対策ソフトを一時的に無効化**してから試す
3. **OneDriveの同期を一時的に停止**してから試す（OneDriveフォルダ内にある場合）

