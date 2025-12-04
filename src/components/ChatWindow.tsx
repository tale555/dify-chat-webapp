import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { callDifyChatApi } from '../services/chatApi';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string; // 画像のプレビューURL
}

function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 初期化時は会話を作成しない（Dify APIは会話IDを自動生成するため）
  // 最初のメッセージ送信時に会話IDが返ってくる

  const handleSendMessage = async (content: string, imageFile?: File) => {
    // 画像がある場合はプレビューURLを生成
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    const userMessage: Message = { 
      role: 'user', 
      content: content || (imageFile ? '画像を分析してください' : ''),
      imageUrl: imageUrl
    };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);
    setIsLoading(true);

    try {
      const result = await callDifyChatApi(content, 'web_user', conversationId || undefined, imageFile);
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // 会話IDが返ってきたら保存（最初のメッセージで会話IDが生成される）
      if (result.conversationId && !conversationId) {
        setConversationId(result.conversationId);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage = error instanceof Error ? error.message : '申し訳ございません。エラーが発生しました。';
      setError(errorMessage);
      const assistantMessage: Message = {
        role: 'assistant',
        content: `エラー: ${errorMessage}`
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white shadow-lg overflow-hidden">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              {error.includes('環境変数') && (
                <p className="mt-2 text-xs text-red-600">
                  README.mdを参照して、.envファイルを正しく設定してください。
                </p>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={handleSendMessage} disabled={isLoading || !!error} />
    </div>
  );
}

export default ChatWindow;
