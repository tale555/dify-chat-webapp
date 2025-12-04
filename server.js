/**
 * Dify API プロキシサーバー
 * CORSエラーを回避するために、APIリクエストを中継します
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .envファイルを読み込む
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORSを許可（環境変数から取得、デフォルトはlocalhost）
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// OPTIONSリクエストを処理（CORSプリフライトリクエスト）
app.options('*', cors());

// multerの設定（メモリストレージを使用）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('画像ファイルのみアップロード可能です'));
    }
  },
});

// 環境変数の確認
const DIFY_API_KEY = process.env.VITE_DIFY_API_KEY;
const DIFY_APP_ID = process.env.VITE_DIFY_APP_ID;
const DIFY_API_BASE_URL = process.env.VITE_DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

if (!DIFY_API_KEY || !DIFY_APP_ID) {
  console.error('❌ エラー: .envファイルにVITE_DIFY_API_KEYとVITE_DIFY_APP_IDが設定されていません');
  process.exit(1);
}

console.log('✅ Dify API プロキシサーバーを起動しました');
console.log(`   API Base URL: ${DIFY_API_BASE_URL}`);

// デバッグ用: すべてのリクエストをログに記録
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 会話作成エンドポイントは削除（Dify APIは会話IDを自動生成するため不要）
// チャットメッセージ送信時に会話IDが返ってくる

// チャットメッセージを送信（画像対応）
app.post('/api/chat-messages', upload.single('image'), async (req, res) => {
  console.log('📥 チャットメッセージリクエストを受信');
  try {
    const query = req.body.query || '';
    const user = req.body.user || 'web_user';
    const conversation_id = req.body.conversation_id;
    const response_mode = req.body.response_mode || 'blocking';
    const imageFile = req.file;

    console.log('📋 リクエスト内容:', {
      query,
      user,
      conversation_id,
      hasImage: !!imageFile,
      imageName: imageFile?.originalname,
    });

    let response;

    if (imageFile) {
      // 画像がある場合: まずDify APIに画像をアップロード
      console.log('📤 画像をDify APIにアップロード中...');
      
      // form-dataパッケージを使用
      const formData = new FormData();
      formData.append('file', imageFile.buffer, {
        filename: imageFile.originalname,
        contentType: imageFile.mimetype,
      });
      formData.append('user', user);

      console.log('📋 アップロード情報:', {
        filename: imageFile.originalname,
        mimetype: imageFile.mimetype,
        size: imageFile.size,
      });

      // axiosを使用してFormDataを送信（fetch APIよりも確実）
      let uploadResponse;
      try {
        uploadResponse = await axios.post(
          `${DIFY_API_BASE_URL}/files/upload`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${DIFY_API_KEY}`,
              ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
      } catch (error) {
        if (error.response) {
          console.error('❌ 画像アップロードエラー:', error.response.status, error.response.data);
          return res.status(error.response.status).json({ 
            error: `画像アップロードに失敗しました: ${JSON.stringify(error.response.data)}`,
            status: error.response.status,
            details: error.response.data
          });
        } else {
          console.error('❌ 画像アップロードエラー:', error.message);
          return res.status(500).json({ 
            error: `画像アップロードに失敗しました: ${error.message}`
          });
        }
      }

      console.log('📥 アップロードレスポンス:', uploadResponse.status, uploadResponse.statusText);

      const uploadData = uploadResponse.data;
      console.log('📋 アップロードレスポンスデータ:', JSON.stringify(uploadData, null, 2));
      
      const fileId = uploadData.id || uploadData.file_id || uploadData.data?.id;
      if (!fileId) {
        console.error('❌ ファイルIDが取得できませんでした:', uploadData);
        return res.status(500).json({ 
          error: 'ファイルIDが取得できませんでした',
          response: uploadData
        });
      }
      
      console.log('✅ 画像アップロード成功:', fileId);

      // チャットメッセージを送信（画像を含む）
      const payload = {
        inputs: {},
        query: query || 'この画像を分析してください',
        user: user,
        response_mode: response_mode,
        files: [{
          type: 'image',
          transfer_method: 'local_file',
          upload_file_id: fileId,
        }],
      };

      if (conversation_id) {
        payload.conversation_id = conversation_id;
      }

      console.log('📤 Dify APIにチャットメッセージを送信（画像付き）:', payload);

      response = await fetch(`${DIFY_API_BASE_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIFY_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
    } else {
      // テキストのみの場合
      const payload = {
        inputs: {},
        query: query,
        user: user,
        response_mode: response_mode,
      };

      if (conversation_id) {
        payload.conversation_id = conversation_id;
      }

      console.log('📤 Dify APIにチャットメッセージを送信（テキストのみ）:', payload);

      response = await fetch(`${DIFY_API_BASE_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIFY_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ チャットメッセージ送信エラー:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ チャットメッセージ送信中にエラー:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 サーバーが http://localhost:${PORT} で起動しました`);
  console.log('📝 フロントエンドから http://localhost:5173 にアクセスしてください');
});

