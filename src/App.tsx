import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ConversationSidebar from './components/ConversationSidebar';
import { Menu } from 'lucide-react';
import {
  getCurrentConversationId,
  getConversation,
  createNewConversation,
  saveConversation,
  type Conversation,
} from './services/conversationStorage';

function App() {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 初期化時に現在の会話を読み込む
  useEffect(() => {
    const currentId = getCurrentConversationId();
    if (currentId) {
      const conv = getConversation(currentId);
      if (conv) {
        setCurrentConversation(conv);
      } else {
        // 会話が見つからない場合は新しい会話を作成
        handleNewConversation();
      }
    } else {
      // 新しい会話を作成
      handleNewConversation();
    }
  }, []);

  const handleNewConversation = () => {
    const newConv = createNewConversation();
    // 新しい会話を保存（空の会話として）
    saveConversation(newConv);
    setCurrentConversation(newConv);
  };

  const handleSelectConversation = (conversation: Conversation | null) => {
    setCurrentConversation(conversation);
  };

  const handleConversationUpdate = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    // サイドバーを更新するためにトリガーを更新
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConversationDeleted = () => {
    // 会話が削除されたときにサイドバーを更新
    setRefreshTrigger(prev => prev + 1);
    
    // 現在の会話が削除された場合、新しい会話を作成
    const currentId = getCurrentConversationId();
    if (!currentId || !getConversation(currentId)) {
      handleNewConversation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="h-screen flex">
        {/* サイドバー */}
        <ConversationSidebar
          currentConversationId={currentConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          refreshTrigger={refreshTrigger}
          onConversationDeleted={handleConversationDeleted}
        />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <header className="bg-white shadow-sm border-b border-slate-200 px-4 lg:px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="メニュー"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Dify Chat Client</h1>
          </header>
          <ChatWindow
            currentConversation={currentConversation}
            onConversationUpdate={handleConversationUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
