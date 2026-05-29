import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://chatbot-backend-8rgm.onrender.com';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Sora', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bg {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,57,242,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 90%, rgba(29,158,117,0.12) 0%, transparent 55%),
      #0a0a0f;
    z-index: 0;
  }

  .app {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 12px 16px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    margin-bottom: 8px;
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }

  .header-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6339f2, #1d9e75);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .header-text h1 {
    font-size: 16px;
    font-weight: 600;
    color: #f0eeff;
    letter-spacing: -0.3px;
    margin-bottom: 2px;
    margin-top: 0px;
    text-align: left;
  }

  .header-text p {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #1d9e75;
    margin-left: auto;
    box-shadow: 0 0 8px #1d9e75;
    animation: pulse 2.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 12px 4px;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: rgba(99,57,242,0.3) transparent;
    min-height: 0;
  }

  .chat-box::-webkit-scrollbar { width: 4px; }
  .chat-box::-webkit-scrollbar-track { background: transparent; }
  .chat-box::-webkit-scrollbar-thumb { background: rgba(99,57,242,0.3); border-radius: 2px; }

  .chat-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0.4;
    user-select: none;
    padding: 40px 0;
  }

  .empty-icon { font-size: 36px; filter: grayscale(1); }

  .empty-state p {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.2px;
  }

  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg-row.user { flex-direction: row-reverse; }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 18px;
  }

  .avatar.user-av {
    background: linear-gradient(135deg, #6339f2, #9b72ff);
    color: white;
  }

  .avatar.ai-av {
    background: rgba(29,158,117,0.15);
    border: 0.5px solid rgba(29,158,117,0.3);
    font-size: 15px;
  }

  .bubble {
    max-width: 100%;
    padding: 11px 15px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.65;
    letter-spacing: 0.1px;
    text-align: left;
  }

  .bubble.user-bubble {
    background: linear-gradient(135deg, #6339f2, #7e56f5);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .bubble.ai-bubble {
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.88);
    border-bottom-left-radius: 4px;
    backdrop-filter: blur(8px);
  }

  .bubble-meta {
    font-size: 10px;
    margin-top: 5px;
    opacity: 0.4;
    font-family: 'JetBrains Mono', monospace;
  }

  .msg-row.user .bubble-meta { text-align: right; }

  /* Code block styles */
  .code-block {
    margin: 8px 0;
    border-radius: 10px;
    overflow: hidden;
    border: 0.5px solid rgba(255,255,255,0.1);
    background: #0d0d14;
    max-width: 100%;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 12px;
    background: rgba(255,255,255,0.05);
    border-bottom: 0.5px solid rgba(255,255,255,0.08);
  }

  .code-lang {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: #1d9e75;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 500;
  }

  .copy-btn {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255,255,255,0.4);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
  }

  .copy-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); }
  .copy-btn.copied { color: #1d9e75; }

  .code-body {
    padding: 14px 16px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(99,57,242,0.3) transparent;
  }

  .code-body::-webkit-scrollbar { height: 4px; }
  .code-body::-webkit-scrollbar-thumb { background: rgba(99,57,242,0.3); border-radius: 2px; }

  .code-body pre {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    color: #e2e8f0;
    white-space: pre;
  }

  /* Inline code */
  .inline-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: rgba(99,57,242,0.2);
    border: 0.5px solid rgba(99,57,242,0.35);
    border-radius: 4px;
    padding: 1px 5px;
    color: #c4b5fd;
  }

  .msg-text p { margin-bottom: 6px; }
  .msg-text p:last-child { margin-bottom: 0; }

  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 18px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(29,158,117,0.7);
    animation: bounce 1.2s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  .error-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(226,75,74,0.1);
    border: 0.5px solid rgba(226,75,74,0.25);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    color: #f09595;
    animation: fadeUp 0.3s ease;
  }

  .input-area {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    margin-top: 8px;
    backdrop-filter: blur(12px);
    align-items: center;
    flex-shrink: 0;
  }

  .input-area textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.88);
    resize: none;
    line-height: 1.6;
    max-height: 120px;
    min-height: 24px;
    padding: 2px 0;
  }

  .input-area textarea::placeholder { color: rgba(255,255,255,0.2); }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6339f2, #7e56f5);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s, opacity 0.15s;
    font-size: 16px;
  }

  .send-btn:hover:not(:disabled) { transform: scale(1.06); }
  .send-btn:active:not(:disabled) { transform: scale(0.95); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .char-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.18);
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
`;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Parse message text into segments: plain text or code blocks
function parseMessage(text) {
  const parts = [];
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

// Render inline code (`code`) within plain text
function renderInlineText(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function CodeBlock({ lang, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{lang}</span>
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <div className="code-body">
        <pre>{content}</pre>
      </div>
    </div>
  );
}

function MessageContent({ text }) {
  const parts = parseMessage(text);
  return (
    <div className="msg-text">
      {parts.map((part, i) =>
        part.type === 'code'
          ? <CodeBlock key={i} lang={part.lang} content={part.content} />
          : <p key={i}>{renderInlineText(part.content)}</p>
      )}
    </div>
  );
}

export default function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = { sender: 'user', text: message, time: getTime() };
    setChat(prev => [...prev, userMsg]);
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/chat', { message, history: chat });
      setChat(prev => [...prev, { sender: 'ai', text: res.data.reply, time: getTime() }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bg" />
      <div className="app">

        <div className="header">
          <div className="header-icon">🤖</div>
          <div className="header-text">
            <h1>AI Assistant</h1>
            <p>Powered by Llama 4 Scout · Groq</p>
          </div>
          <div className="status-dot" title="Online" />
        </div>

        <div className="chat-box">
          <div className="chat-inner">
            {chat.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>Send a message to start chatting</p>
              </div>
            )}

            {chat.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`avatar ${msg.sender === 'user' ? 'user-av' : 'ai-av'}`}>
                  {msg.sender === 'user' ? 'You' : '🤖'}
                </div>
                <div style={{ maxWidth: '78%' }}>
                  <div className={`bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.sender === 'ai'
                      ? <MessageContent text={msg.text} />
                      : msg.text
                    }
                  </div>
                  <div className="bubble-meta">{msg.time}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-row">
                <div className="avatar ai-av">🤖</div>
                <div className="bubble ai-bubble typing-bubble">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}

            {error && <div className="error-msg">⚠️ {error}</div>}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="input-area">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => { setMessage(e.target.value); autoResize(); }}
            onKeyDown={handleKey}
            placeholder="Ask me anything…"
            disabled={loading}
            rows={1}
          />
          <span className="char-hint">↵ send</span>
          <button className="send-btn" onClick={sendMessage} disabled={loading || !message.trim()} aria-label="Send">
            {loading ? '⏳' : '➤'}
          </button>
        </div>

      </div>
    </>
  );
}