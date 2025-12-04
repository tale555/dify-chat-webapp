/**
 * 会話履歴のローカルストレージ管理
 */

import type { Message } from '../components/ChatWindow';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  conversationId: string | null;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'dify-chat-conversations';
const CURRENT_CONVERSATION_KEY = 'dify-chat-current-conversation';

/**
 * すべての会話を取得
 */
export function getAllConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('会話履歴の読み込みエラー:', error);
    return [];
  }
}

/**
 * 会話を保存
 */
export function saveConversation(conversation: Conversation): void {
  try {
    const conversations = getAllConversations();
    const existingIndex = conversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex >= 0) {
      // 既存の会話を更新
      conversations[existingIndex] = conversation;
    } else {
      // 新しい会話を追加
      conversations.unshift(conversation); // 最新を先頭に
    }
    
    // 更新日時を更新
    conversation.updatedAt = Date.now();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('会話履歴の保存エラー:', error);
  }
}

/**
 * 会話を取得
 */
export function getConversation(id: string): Conversation | null {
  const conversations = getAllConversations();
  return conversations.find(c => c.id === id) || null;
}

/**
 * 会話を削除
 */
export function deleteConversation(id: string): void {
  try {
    const conversations = getAllConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // 削除した会話が現在の会話の場合、現在の会話IDをクリア
    const currentId = getCurrentConversationId();
    if (currentId === id) {
      clearCurrentConversationId();
    }
  } catch (error) {
    console.error('会話履歴の削除エラー:', error);
  }
}

/**
 * 現在の会話IDを取得
 */
export function getCurrentConversationId(): string | null {
  try {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    console.error('現在の会話IDの読み込みエラー:', error);
    return null;
  }
}

/**
 * 現在の会話IDを設定
 */
export function setCurrentConversationId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    }
  } catch (error) {
    console.error('現在の会話IDの保存エラー:', error);
  }
}

/**
 * 現在の会話IDをクリア
 */
export function clearCurrentConversationId(): void {
  localStorage.removeItem(CURRENT_CONVERSATION_KEY);
}

/**
 * 会話のタイトルを生成（最初のメッセージから）
 */
export function generateConversationTitle(messages: Message[]): string {
  if (messages.length === 0) {
    return '新しい会話';
  }
  
  // 最初のユーザーメッセージを取得
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) {
    return '新しい会話';
  }
  
  // タイトルとして使用（最大30文字）
  const title = firstUserMessage.content.trim();
  if (title.length === 0) {
    return '画像を添付';
  }
  
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

/**
 * 新しい会話を作成
 */
export function createNewConversation(): Conversation {
  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: '新しい会話',
    messages: [],
    conversationId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

