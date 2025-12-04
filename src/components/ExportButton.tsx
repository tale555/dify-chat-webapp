import { useState } from 'react';
import { Download, FileText, File, Printer } from 'lucide-react';
import { exportAsText, exportAsPDF, printConversation } from '../services/exportConversation';
import type { Conversation } from '../services/conversationStorage';

interface ExportButtonProps {
  conversation: Conversation | null;
}

function ExportButton({ conversation }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!conversation || conversation.messages.length === 0) {
    return null;
  }

  const handleExport = (format: 'text' | 'pdf' | 'print') => {
    if (!conversation) return;

    try {
      switch (format) {
        case 'text':
          exportAsText(conversation);
          break;
        case 'pdf':
          exportAsPDF(conversation);
          break;
        case 'print':
          printConversation(conversation);
          break;
      }
      setIsOpen(false);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('エクスポートに失敗しました。');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 text-sm"
        title="会話をエクスポート"
      >
        <Download size={16} />
        <span className="hidden sm:inline">エクスポート</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[200px]">
            <button
              onClick={() => handleExport('text')}
              className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center gap-3 text-sm"
            >
              <FileText size={18} className="text-slate-600" />
              <div>
                <div className="font-medium">テキスト形式</div>
                <div className="text-xs text-slate-500">.txt</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center gap-3 text-sm border-t border-slate-200"
            >
              <File size={18} className="text-slate-600" />
              <div>
                <div className="font-medium">PDF形式</div>
                <div className="text-xs text-slate-500">印刷</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('print')}
              className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center gap-3 text-sm border-t border-slate-200"
            >
              <Printer size={18} className="text-slate-600" />
              <div>
                <div className="font-medium">印刷</div>
                <div className="text-xs text-slate-500">直接印刷</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportButton;

