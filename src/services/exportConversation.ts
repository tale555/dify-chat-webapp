/**
 * 会話のエクスポート機能
 */

import type { Message } from '../components/ChatWindow';
import type { Conversation } from './conversationStorage';

/**
 * テキスト形式でエクスポート
 */
export function exportAsText(conversation: Conversation): void {
  let content = `会話: ${conversation.title}\n`;
  content += `作成日時: ${new Date(conversation.createdAt).toLocaleString('ja-JP')}\n`;
  content += `更新日時: ${new Date(conversation.updatedAt).toLocaleString('ja-JP')}\n`;
  content += `メッセージ数: ${conversation.messages.length}\n`;
  content += '\n' + '='.repeat(50) + '\n\n';

  conversation.messages.forEach((message, index) => {
    const role = message.role === 'user' ? 'ユーザー' : 'アシスタント';
    content += `[${index + 1}] ${role}\n`;
    if (message.imageUrl) {
      content += '[画像が添付されています]\n';
    }
    content += `${message.content}\n\n`;
  });

  // ファイルとしてダウンロード
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conversation.title.replace(/[^\w\s]/gi, '')}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Markdown形式でエクスポート
 */
export function exportAsMarkdown(conversation: Conversation): void {
  let content = `# ${conversation.title}\n\n`;
  content += `**作成日時:** ${new Date(conversation.createdAt).toLocaleString('ja-JP')}\n`;
  content += `**更新日時:** ${new Date(conversation.updatedAt).toLocaleString('ja-JP')}\n`;
  content += `**メッセージ数:** ${conversation.messages.length}\n\n`;
  content += '---\n\n';

  conversation.messages.forEach((message, index) => {
    const role = message.role === 'user' ? 'ユーザー' : 'アシスタント';
    const roleEmoji = message.role === 'user' ? '👤' : '🤖';
    content += `## ${index + 1}. ${roleEmoji} ${role}\n\n`;
    
    if (message.imageUrl) {
      content += `![添付画像](${message.imageUrl})\n\n`;
    }
    
    // Markdown形式でエスケープ
    const escapedContent = message.content
      .replace(/\n/g, '\n\n')
      .replace(/\*\*/g, '\\*\\*')
      .replace(/\*/g, '\\*')
      .replace(/#/g, '\\#');
    
    content += `${escapedContent}\n\n`;
    content += '---\n\n';
  });

  // ファイルとしてダウンロード
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conversation.title.replace(/[^\w\s]/gi, '')}_${new Date().toISOString().split('T')[0]}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * PDF形式でエクスポート（簡易版 - 印刷機能を使用）
 */
export function exportAsPDF(conversation: Conversation): void {
  // 印刷用のHTMLを作成
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('ポップアップがブロックされています。ブラウザの設定を確認してください。');
    return;
  }

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${conversation.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .metadata {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 30px;
          padding: 15px;
          border-left: 4px solid #ddd;
          background: #fafafa;
        }
        .message.user {
          border-left-color: #3b82f6;
        }
        .message.assistant {
          border-left-color: #10b981;
        }
        .message-header {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .message-content {
          white-space: pre-wrap;
        }
        .message-image {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 5px;
        }
        @media print {
          body {
            padding: 0;
          }
          .message {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>${conversation.title}</h1>
      <div class="metadata">
        <p><strong>作成日時:</strong> ${new Date(conversation.createdAt).toLocaleString('ja-JP')}</p>
        <p><strong>更新日時:</strong> ${new Date(conversation.updatedAt).toLocaleString('ja-JP')}</p>
        <p><strong>メッセージ数:</strong> ${conversation.messages.length}</p>
      </div>
  `;

  conversation.messages.forEach((message, index) => {
    const role = message.role === 'user' ? 'ユーザー' : 'アシスタント';
    const roleEmoji = message.role === 'user' ? '👤' : '🤖';
    html += `
      <div class="message ${message.role}">
        <div class="message-header">${index + 1}. ${roleEmoji} ${role}</div>
    `;
    
    if (message.imageUrl) {
      html += `<img src="${message.imageUrl}" alt="添付画像" class="message-image" />`;
    }
    
    html += `
        <div class="message-content">${escapeHtml(message.content)}</div>
      </div>
    `;
  });

  html += `
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // 印刷ダイアログを表示
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

/**
 * 会話を印刷
 */
export function printConversation(conversation: Conversation): void {
  exportAsPDF(conversation);
}

