/**
 * Dify API連携用の型定義
 */
export interface DifyChatRequest {
  query: string;
  user: string;
  response_mode?: 'blocking' | 'streaming';
  conversation_id?: string;
  inputs?: Record<string, any>;
}

export interface DifyChatResponse {
  answer: string;
  conversation_id?: string;
  message_id: string;
  metadata?: Record<string, any>;
}

export interface DifyChatResult {
  answer: string;
  conversationId?: string;
}

export interface DifyApiError {
  message: string;
  code?: string;
  status?: string;
}

/**
 * バックエンドAPIのベースURL
 * 開発環境ではローカルのプロキシサーバーを使用
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Dify APIにチャットメッセージを送信
 * 
 * @param userMessage ユーザーのメッセージ
 * @param userId ユーザーID（デフォルト: 'web_user'）
 * @param conversationId 会話ID（会話履歴を保持する場合）
 * @returns AIの応答テキスト
 */
export async function callDifyChatApi(
  userMessage: string,
  userId: string = 'web_user',
  conversationId?: string,
  imageFile?: File
): Promise<DifyChatResult> {
  try {
    const url = `${API_BASE_URL}/chat-messages`;

    let response: Response;

    if (imageFile) {
      // 画像ファイルがある場合はFormDataを使用
      const formData = new FormData();
      formData.append('query', userMessage);
      formData.append('user', userId);
      formData.append('response_mode', 'blocking');
      if (conversationId) {
        formData.append('conversation_id', conversationId);
      }
      formData.append('image', imageFile);

      response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
    } else {
      // テキストのみの場合はJSON
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      const requestBody: DifyChatRequest = {
        query: userMessage,
        user: userId,
        response_mode: 'blocking',
        ...(conversationId && { conversation_id: conversationId }),
      };

      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        // JSON解析に失敗した場合は、テキストを取得
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }

      throw new Error(errorMessage);
    }

    const data: DifyChatResponse = await response.json();
    
    return {
      answer: data.answer || '応答が空です。',
      conversationId: data.conversation_id,
    };

  } catch (error) {
    if (error instanceof Error) {
      // エラーメッセージをそのまま返す
      throw error;
    }
    throw new Error('予期しないエラーが発生しました。');
  }
}

// 会話作成関数は削除（Dify APIは会話IDを自動生成するため不要）
// チャットメッセージ送信時に会話IDが返ってくる
