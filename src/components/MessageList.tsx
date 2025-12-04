import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import MessageMenu from './MessageMenu';
import type { Message } from './ChatWindow';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onCopyMessage?: (message: Message) => void;
  onEditMessage?: (messageIndex: number, newContent: string) => void;
  onDeleteMessage?: (messageIndex: number) => void;
  onRegenerateMessage?: (messageIndex: number) => void;
}

function MessageList({
  messages,
  isLoading,
  onCopyMessage,
  onEditMessage,
  onDeleteMessage,
  onRegenerateMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-slate-400">
          <p>Start a conversation...</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-3 group ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
          )}

          <div
            className={`max-w-[70%] rounded-lg px-4 py-3 relative group ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {message.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.imageUrl}
                  alt="送信した画像"
                  className="max-w-full max-h-64 rounded-lg border border-slate-300"
                />
              </div>
            )}
            {message.content && (
              <p className="whitespace-pre-wrap break-words pr-8">{message.content}</p>
            )}
            
            {/* メニューボタン */}
            <div className="absolute top-2 right-2">
              <MessageMenu
                message={message}
                messageIndex={index}
                onCopy={onCopyMessage || (() => {})}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage || (() => {})}
                onRegenerate={onRegenerateMessage}
                isUserMessage={message.role === 'user'}
                isLastMessage={index === messages.length - 1}
              />
            </div>
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className="max-w-[70%] rounded-lg px-4 py-3 bg-slate-100">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
