import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import {
  getAllConversations,
  deleteConversation,
  type Conversation,
} from '../services/conversationStorage';

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (conversation: Conversation | null) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger?: number; // 会話が更新されたときに再読み込みするためのトリガー
  onConversationDeleted?: () => void; // 会話が削除されたときに呼ばれるコールバック
}

function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isOpen,
  onClose,
  refreshTrigger,
  onConversationDeleted,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
    
    // ストレージ変更を監視（他のタブでの変更を検知）
    const handleStorageChange = () => {
      loadConversations();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshTrigger]); // refreshTriggerが変更されたときに再読み込み

  const loadConversations = () => {
    const allConversations = getAllConversations();
    setConversations(allConversations);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm('この会話を削除しますか？')) {
      const wasCurrentConversation = currentConversationId === id;
      
      // 会話を削除
      deleteConversation(id);
      
      // 会話リストを再読み込み
      loadConversations();
      
      // コールバックを呼び出して親コンポーネントに通知
      if (onConversationDeleted) {
        onConversationDeleted();
      }
      
      // 削除した会話が現在の会話の場合、新しい会話を作成
      if (wasCurrentConversation) {
        onNewConversation();
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* モバイル用のオーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-800 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* ヘッダー */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare size={20} />
            会話履歴
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewConversation}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              title="新しい会話"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
              title="閉じる"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 会話リスト */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-slate-400 text-sm text-center">
              会話履歴がありません
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation);
                    onClose();
                  }}
                  className={`
                    p-3 rounded-lg mb-2 cursor-pointer
                    transition-colors
                    ${
                      currentConversationId === conversation.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-700 text-slate-200'
                    }
                    group
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {formatDate(conversation.updatedAt)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {conversation.messages.length}件のメッセージ
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="
                        p-1 opacity-0 group-hover:opacity-100
                        hover:bg-red-600 rounded transition-all
                      "
                      title="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ConversationSidebar;

