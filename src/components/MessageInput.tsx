import { useState, KeyboardEvent, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if ((trimmedInput || selectedImage) && !disabled) {
      onSend(trimmedInput || '画像を分析してください', selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 画像ファイルかチェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }
      
      // ファイルサイズチェック（10MB以下）
      if (file.size > 10 * 1024 * 1024) {
        alert('画像サイズは10MB以下にしてください');
        return;
      }

      setSelectedImage(file);
      
      // プレビュー用のURLを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 p-4 bg-white">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border border-slate-300"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex gap-3 items-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 bg-slate-100 text-slate-700 rounded-lg px-3 py-3 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 transition-colors duration-200 flex items-center justify-center"
          type="button"
          title="画像を添付"
        >
          <ImageIcon size={20} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={disabled}
          className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400 min-h-[60px] max-h-[200px]"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={(!input.trim() && !selectedImage) || disabled}
          className="flex-shrink-0 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}

export default MessageInput;
