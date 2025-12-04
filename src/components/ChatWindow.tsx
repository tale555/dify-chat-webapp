import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ExportButton from './ExportButton';
import { callDifyChatApi } from '../services/chatApi';
import {
  saveConversation,
  getConversation,
  getCurrentConversationId,
  setCurrentConversationId,
  generateConversationTitle,
  createNewConversation,
  type Conversation,
} from '../services/conversationStorage';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string; // 画像のプレビューURL
}

interface ChatWindowProps {
  currentConversation: Conversation | null;
  onConversationUpdate: (conversation: Conversation) => void;
}

function ChatWindow({ currentConversation, onConversationUpdate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);

  // 会話が変更されたときにメッセージを読み込む
  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages);
      setConversationId(currentConversation.conversationId);
      setCurrentConvId(currentConversation.id);
      setCurrentConversationId(currentConversation.id);
    } else {
      // 新しい会話
      setMessages([]);
      setConversationId(null);
      setCurrentConvId(null);
      setCurrentConversationId(null);
    }
  }, [currentConversation]);

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
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setError(null);
    setIsLoading(true);

    try {
      const result = await callDifyChatApi(content, 'web_user', conversationId || undefined, imageFile);
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // 会話IDが返ってきたら保存（最初のメッセージで会話IDが生成される）
      let finalConversationId = conversationId;
      if (result.conversationId && !conversationId) {
        finalConversationId = result.conversationId;
        setConversationId(result.conversationId);
      }
      
      // 会話を保存
      let conv: Conversation;
      if (currentConvId) {
        // 既存の会話を更新
        const existingConv = getConversation(currentConvId);
        if (existingConv) {
          conv = {
            ...existingConv,
            messages: finalMessages,
            conversationId: finalConversationId,
            title: generateConversationTitle(finalMessages),
            updatedAt: Date.now(),
          };
        } else {
          // 会話が見つからない場合は新規作成
          conv = {
            ...createNewConversation(),
            id: currentConvId,
            messages: finalMessages,
            conversationId: finalConversationId,
            title: generateConversationTitle(finalMessages),
          };
        }
      } else {
        // 新しい会話を作成
        conv = {
          ...createNewConversation(),
          messages: finalMessages,
          conversationId: finalConversationId,
          title: generateConversationTitle(finalMessages),
        };
        setCurrentConvId(conv.id);
        setCurrentConversationId(conv.id);
      }
      
      saveConversation(conv);
      onConversationUpdate(conv);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage = error instanceof Error ? error.message : '申し訳ございません。エラーが発生しました。';
      setError(errorMessage);
      const assistantMessage: Message = {
        role: 'assistant',
        content: `エラー: ${errorMessage}`
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // エラーが発生しても会話を保存（エラーメッセージも含む）
      let conv: Conversation;
      if (currentConvId) {
        const existingConv = getConversation(currentConvId);
        if (existingConv) {
          conv = {
            ...existingConv,
            messages: finalMessages,
            updatedAt: Date.now(),
          };
        } else {
          // 会話が見つからない場合は新規作成
          conv = {
            ...createNewConversation(),
            id: currentConvId,
            messages: finalMessages,
            title: generateConversationTitle(finalMessages),
          };
        }
      } else {
        // 新しい会話を作成
        conv = {
          ...createNewConversation(),
          messages: finalMessages,
          title: generateConversationTitle(finalMessages),
        };
        setCurrentConvId(conv.id);
        setCurrentConversationId(conv.id);
      }
      
      saveConversation(conv);
      onConversationUpdate(conv);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content).then(() => {
      // コピー成功のフィードバック（オプション）
      console.log('メッセージをコピーしました');
    }).catch((err) => {
      console.error('コピーに失敗しました:', err);
    });
  };

  const handleEditMessage = (messageIndex: number, newContent: string) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
    };
    setMessages(updatedMessages);

    // 会話を保存
    if (currentConvId) {
      const existingConv = getConversation(currentConvId);
      if (existingConv) {
        const conv = {
          ...existingConv,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
        saveConversation(conv);
        onConversationUpdate(conv);
      }
    }
  };

  const handleDeleteMessage = (messageIndex: number) => {
    const updatedMessages = messages.filter((_, index) => index !== messageIndex);
    setMessages(updatedMessages);

    // 会話を保存
    if (currentConvId) {
      const existingConv = getConversation(currentConvId);
      if (existingConv) {
        const conv = {
          ...existingConv,
          messages: updatedMessages,
          title: generateConversationTitle(updatedMessages),
          updatedAt: Date.now(),
        };
        saveConversation(conv);
        onConversationUpdate(conv);
      }
    }
  };

  const handleRegenerateMessage = async (messageIndex: number) => {
    // 再生成するメッセージより前のメッセージを取得
    const messagesBefore = messages.slice(0, messageIndex);
    
    // 最後のユーザーメッセージを取得
    const lastUserMessage = [...messagesBefore].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
      return;
    }

    // 再生成するメッセージ以降を削除
    const updatedMessages = messagesBefore;
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      // 最後のユーザーメッセージを再送信
      const result = await callDifyChatApi(
        lastUserMessage.content,
        'web_user',
        conversationId || undefined,
        undefined // 画像は再送信しない
      );
      
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // 会話IDが返ってきたら保存
      let finalConversationId = conversationId;
      if (result.conversationId && !conversationId) {
        finalConversationId = result.conversationId;
        setConversationId(result.conversationId);
      }

      // 会話を保存
      if (currentConvId) {
        const existingConv = getConversation(currentConvId);
        if (existingConv) {
          const conv = {
            ...existingConv,
            messages: finalMessages,
            conversationId: finalConversationId,
            updatedAt: Date.now(),
          };
          saveConversation(conv);
          onConversationUpdate(conv);
        }
      }
    } catch (error) {
      console.error('再生成に失敗しました:', error);
      const errorMessage = error instanceof Error ? error.message : '申し訳ございません。エラーが発生しました。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white shadow-lg overflow-hidden">
      {/* エクスポートボタン */}
      {currentConversation && messages.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-200 flex justify-end">
          <ExportButton conversation={currentConversation} />
        </div>
      )}
      
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
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onCopyMessage={handleCopyMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onRegenerateMessage={handleRegenerateMessage}
      />
      <MessageInput onSend={handleSendMessage} disabled={isLoading || !!error} />
    </div>
  );
}

export default ChatWindow;
