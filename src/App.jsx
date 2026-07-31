import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://chatbot-backend-8rgm.onrender.com';

const styles = `

  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'VT323', monospace;
    background: #051405;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4af626;
    overflow: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    background: #051405;
    z-index: 0;
  }

  .bg::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to bottom,
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    z-index: 50;
    pointer-events: none;
  }

  .bg::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);
    z-index: 51;
    pointer-events: none;
  }

  .app {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 800px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 30px;
    text-shadow: 0 0 5px rgba(74, 246, 38, 0.7);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 2px solid #4af626;
    margin-bottom: 20px;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .header-icon {
    font-size: 24px;
    margin-right: 15px;
    animation: blink 2s step-end infinite;
  }

  .header-text {
    flex: 1;
  }

  .header-text h1 {
    font-size: 28px;
    font-weight: normal;
    letter-spacing: 2px;
    margin-bottom: 5px;
  }

  p {
    white-space: pre-wrap;
  }

  .header-text p {
    font-size: 18px;
    opacity: 0.8;
  }

  .chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: #4af626 transparent;
    min-height: 0;
    border: 1px solid rgba(74, 246, 38, 0.3);
    background: rgba(0, 20, 0, 0.5);
    box-shadow: inset 0 0 30px rgba(74, 246, 38, 0.1);
  }

  .chat-inner {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    opacity: 0.7;
    padding: 40px 0;
    text-transform: uppercase;
  }

  .empty-icon { font-size: 48px; animation: blink 1.5s step-start infinite; }
  .empty-state p { font-size: 18px; }

  .msg-row {
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.1s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .avatar {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    text-transform: uppercase;
  }

  .user-av { color: #4af626; opacity: 0.8; }
  .ai-av { color: #4af626; }

  .bubble {
    font-size: 22px;
    line-height: 1.4;
    letter-spacing: 1px;
    text-align: left;
    padding-left: 15px;
    border-left: 3px solid rgba(74, 246, 38, 0.5);
  }

  .bubble-meta {
    font-size: 16px;
    margin-top: 5px;
    opacity: 0.5;
    padding-left: 15px;
  }

  /* Code block styles */
  .code-block {
    margin: 10px 0;
    border: 1px solid #4af626;
    background: rgba(74, 246, 38, 0.05);
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    background: #4af626;
    color: #051405;
    text-shadow: none;
  }

  .code-lang {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .copy-btn {
    font-size: 16px;
    color: #051405;
    background: transparent;
    border: 1px solid #051405;
    cursor: pointer;
    padding: 2px 8px;
    text-transform: uppercase;
    font-family: 'VT323', monospace;
  }
  .copy-btn:hover { background: #051405; color: #4af626; }

  .code-body {
    padding: 15px;
    overflow-x: auto;
  }

  .code-body pre {
    margin: 0;
    font-size: 20px;
    color: #4af626;
    white-space: pre;
    font-family: 'VT323', monospace;
  }

  /* Inline code */
  .inline-code {
    background: rgba(74, 246, 38, 0.2);
    padding: 0 6px;
    border: 1px solid rgba(74, 246, 38, 0.5);
  }

  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 15px;
  }

  .dot {
    width: 12px;
    height: 20px;
    background: #4af626;
    animation: blink 1s step-end infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .error-msg {
    color: #ff3333;
    text-shadow: 0 0 5px rgba(255, 51, 51, 0.7);
    border: 1px solid #ff3333;
    padding: 10px;
    margin-top: 10px;
    text-transform: uppercase;
  }

  .input-area {
    display: flex;
    gap: 15px;
    padding: 20px 0 0 0;
    align-items: flex-end;
    flex-shrink: 0;
  }

  .input-area textarea {
    flex: 1;
    background: transparent;
    border: 2px solid #4af626;
    outline: none;
    font-family: 'VT323', monospace;
    font-size: 24px;
    color: #4af626;
    resize: none;
    line-height: 1.4;
    max-height: 150px;
    min-height: 48px;
    padding: 8px 12px;
    text-shadow: 0 0 5px rgba(74, 246, 38, 0.7);
    box-shadow: inset 0 0 10px rgba(74, 246, 38, 0.1);
  }

  .input-area textarea::placeholder { color: rgba(74, 246, 38, 0.3); text-transform: uppercase; }
  .input-area textarea:focus { background: rgba(74, 246, 38, 0.05); }

  .send-btn {
    height: 48px;
    padding: 0 25px;
    border: 2px solid #4af626;
    background: rgba(74, 246, 38, 0.2);
    color: #4af626;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 20px;
    text-transform: uppercase;
    text-shadow: 0 0 5px rgba(74, 246, 38, 0.7);
    transition: all 0.2s;
  }

  .send-btn:hover:not(:disabled) { background: #4af626; color: #051405; text-shadow: none; }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; border-style: dashed; }

  .char-hint {
    display: none;
  }

  .status-dot {
    width: 20px;
    height: 20px;
    background: #4af626;
    box-shadow: 0 0 10px #4af626;
    animation: blink 2s step-start infinite;
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


function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!|{}<>[]^~ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const charArray = chars.split('');
    
    const fontSize = 16;
    const drops = [];
    
    const initDrops = () => {
        const columns = width / fontSize;
        for (let i = 0; i < columns; i++) {
            if (drops[i] === undefined) drops[i] = Math.random() * -100;
        }
    };
    initDrops();

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 20, 5, 0.1)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + 'px VT323, monospace';
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize;
        
        if (Math.random() > 0.95) {
            ctx.fillStyle = '#e0ffe0';
        } else {
            ctx.fillStyle = '#4af626';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDrops();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', opacity: 0.6 }} />;
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
      <div className="bg">
        <MatrixBackground />
      </div>
      <div className="app">

        <div className="header">
          <div className="header-icon">❖</div>
          <div className="header-text">
            <h1>ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</h1>
            <p>COPYRIGHT 2077 ROBCO(R) - SYSOP: Llama 3.1</p>
          </div>
          <div className="status-dot" title="Online" />
        </div>

        <div className="chat-box">
          <div className="chat-inner">
            {chat.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">■</div>
                <p>AWAITING USER INPUT...</p>
              </div>
            )}

            {chat.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`avatar ${msg.sender === 'user' ? 'user-av' : 'ai-av'}`}>
                  {msg.sender === 'user' ? 'USER >' : 'SYS >'}
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
                <div className="avatar ai-av">SYS ></div>
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
            placeholder="ENTER COMMAND..."
            disabled={loading}
            rows={1}
          />
          <span className="char-hint">↵ send</span>
          <button className="send-btn" onClick={sendMessage} disabled={loading || !message.trim()} aria-label="Send">
            {loading ? 'WAIT' : 'EXEC'}
          </button>
        </div>

      </div>
    </>
  );
}