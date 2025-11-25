
import React, { useState, useRef, useEffect } from 'react';
import { AppContextType } from '../types';
import Icon from './Icon';
import { GoogleGenAI } from "@google/genai";

interface ChatPanelProps {
  app: AppContextType;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ app }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // System prompt with context about Suman Mandal
      const systemPrompt = `You are a personal AI assistant representing Suman Mandal. Your role is to answer questions about Suman and help visitors learn more about him.

**About Suman Mandal:**
- Currently pursuing BS in Data Science & Applications at Indian Institute of Technology (IIT) Madras (Expected 2026-2030)
- Focus areas: Deep Learning, Big Data, Neural Networks, and NLP
- Location: India
- Status: Open to Opportunities

**Education:**
- Bachelor of Science in Data Science & Applications
- Institution: Indian Institute of Technology, Madras
- Specialization: Deep Learning and Big Data

**Experience:**
- Student Researcher in Neural Networks / NLP - Researching architecture optimization for Low-Resource LLMs
- Open Source Contributor (Python / AI Tools) - Contributed to libraries like LangChain and HuggingFace Transformers

**Technical Skills:**
- Programming: Python, JavaScript/TypeScript, SQL
- AI/ML: PyTorch, TensorFlow, Transformers, LangChain
- Data Science: Pandas, NumPy, Scikit-learn
- Web Development: React, Next.js, Node.js
- Tools: Git, Docker, Jupyter

**Interests:**
- Building bridges between theoretical AI and production systems
- Optimizing neural network architectures
- Contributing to open-source AI projects
- Low-Resource Language Models

**How to respond:**
1. Answer questions about Suman's background, education, skills, projects, and experience enthusiastically and in first person (as if you ARE Suman)
2. For questions about the portfolio site itself (like "show me your projects"), mention that you can explore the different sections in the navigation - check out the projects, experience, or skills sections
3. For general questions unrelated to Suman (like coding help, general knowledge, etc.), politely say: "I'm Suman's personal assistant, focused on sharing information about him and his work. For questions about me specifically, feel free to ask! You can also explore the navigation menu to see my projects, skills, and experience."
4. Be friendly, professional, and conversational
5. Act as Suman himself - use "I" and "my" when referring to Suman
6. Keep responses concise but informative

Remember: You ARE Suman Mandal. Speak in first person about your education, experience, and skills.`;

      // Include system prompt with user message
      const fullPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const responseText = response.text || "No response generated.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to AI service. Please check API Key configuration." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleMaximize = () => {
    // Toggle between a wider view (600px) and standard (320px)
    if (app.chatWidth > 500) {
      app.setChatWidth(320);
    } else {
      app.setChatWidth(600);
    }
  };

  return (
    <div
      className="bg-[var(--bg-sidebar)] border-l border-[var(--border)] flex flex-col h-full flex-shrink-0 shadow-xl z-20 relative"
      style={{ width: `${app.chatWidth}px` }}
    >
      {/* Header */}
      <div className="h-9 bg-[var(--bg-activity)] flex items-center justify-between px-4 border-b border-[var(--border)] select-none flex-shrink-0">
        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Icon name="chat" size={12} className="text-[var(--accent)]" /> Ask About Suman
        </span>
        <div className="flex items-center gap-2">
          <div onClick={handleToggleMaximize} className="cursor-pointer hover:text-[var(--text-primary)] text-[var(--text-secondary)]" title={app.chatWidth > 500 ? "Restore" : "Maximize"}>
            <Icon name={app.chatWidth > 500 ? "check" : "extensions"} size={12} /> {/* Using icons somewhat representative of size/restore until proper maximize icon exists */}
          </div>
          <div onClick={() => app.setChatOpen(false)} className="cursor-pointer hover:text-[var(--text-primary)] text-[var(--text-secondary)]">
            <Icon name="x" size={14} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-[var(--text-secondary)] text-xs mt-10 opacity-50">
            <Icon name="chat" size={48} className="mx-auto mb-2 opacity-20" />
            <p>Hi! I'm Suman's AI assistant.</p>
            <p className="mt-1">Feel free to ask me anything about Suman Mandal!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded p-2 text-sm whitespace-pre-wrap font-sans ${msg.role === 'user'
                ? 'bg-[var(--accent)] text-[var(--bg-main)]'
                : 'bg-[var(--bg-activity)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-activity)] p-2 rounded text-xs text-[var(--text-secondary)] border border-[var(--border)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-main)] flex-shrink-0">
        <div className="relative">
          <textarea
            className="w-full bg-[var(--bg-activity)] border border-[var(--border)] rounded text-[var(--text-primary)] text-sm p-2 pr-8 outline-none focus:border-[var(--accent)] resize-none scrollbar-thin"
            rows={3}
            placeholder="Ask me about Suman..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div
            className={`absolute right-2 bottom-2 p-1 rounded cursor-pointer transition-colors ${input.trim() ? 'text-[var(--accent)] hover:bg-[var(--bg-sidebar)]' : 'text-[var(--text-secondary)] opacity-50'}`}
            onClick={handleSend}
          >
            <Icon name="send" size={16} />
          </div>
        </div>
        <div className="text-[10px] text-[var(--text-secondary)] mt-1 text-center">
          Powered by passion of developer
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;