import { useState, useRef, useEffect } from 'react';
import { Copy, Edit, Trash2, RotateCcw, MoreVertical, X } from 'lucide-react';
import type { Message } from './ChatWindow';

interface MessageMenuProps {
  message: Message;
  messageIndex: number;
  onCopy: (message: Message) => void;
  onEdit?: (messageIndex: number, newContent: string) => void;
  onDelete: (messageIndex: number) => void;
  onRegenerate?: (messageIndex: number) => void;
  isUserMessage: boolean;
  isLastMessage: boolean;
}

function MessageMenu({
  message,
  messageIndex,
  onCopy,
  onEdit,
  onDelete,
  onRegenerate,
  isUserMessage,
  isLastMessage,
}: MessageMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // メニューの外側をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 編集モードに入ったときにフォーカス
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(
        editInputRef.current.value.length,
        editInputRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleCopy = () => {
    onCopy(message);
    setIsOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(messageIndex, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('このメッセージを削除しますか？')) {
      onDelete(messageIndex);
    }
    setIsOpen(false);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(messageIndex);
    }
    setIsOpen(false);
  };

  if (isEditing && isUserMessage) {
    return (
      <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <textarea
          ref={editInputRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSaveEdit();
            } else if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
          className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            保存
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 text-sm"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-opacity"
        title="メニュー"
      >
        <MoreVertical size={16} className={isUserMessage ? 'text-white' : 'text-slate-600'} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-2 text-sm"
          >
            <Copy size={16} />
            コピー
          </button>

          {isUserMessage && onEdit && (
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-2 text-sm"
            >
              <Edit size={16} />
              編集
            </button>
          )}

          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            削除
          </button>

          {!isUserMessage && isLastMessage && onRegenerate && (
            <button
              onClick={handleRegenerate}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 flex items-center gap-2 text-sm border-t border-slate-200"
            >
              <RotateCcw size={16} />
              再生成
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageMenu;

