import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Cpu, Loader2, Bot } from 'lucide-react';
import { api } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string | null;
  tool_called?: string;
  tool_result?: any;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialImage?: string | null;
}

export function ChatModal({ isOpen, onClose, initialQuery = '', initialImage = null }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with initialQuery/Image if provided
  useEffect(() => {
    if (isOpen) {
      if ((initialQuery || initialImage) && messages.length === 0) {
        handleSend(initialQuery, initialImage);
      } else if (messages.length === 0) {
        setMessages([{ role: 'model', content: "Hello! I'm NEXUS, your campus intelligence layer. How can I help you today?" }]);
      }
    }
  }, [isOpen, initialQuery, initialImage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string, imageStr: string | null = null) => {
    if (!text.trim() && !imageStr) return;

    const userMessage: ChatMessage = { role: 'user', content: text, image: imageStr };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post<{ role: string, content: string, tool_called?: string }>('/api/chat/', {
        messages: newMessages
      });

      setMessages(prev => [...prev, {
        role: (response.role as 'user' | 'model') || 'model',
        content: response.content,
        tool_called: response.tool_called
      }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: `Error: ${err.message || 'Failed to connect to NEXUS AI.'}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-nexus-bg sm:rounded-2xl shadow-2xl border border-nexus-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-nexus-border bg-nexus-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-cyan to-nexus-blue flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-nexus-text">NEXUS AI</h2>
                  <p className="text-[10px] text-nexus-cyan font-medium tracking-wider">INTELLIGENT CAMPUS ASSISTANT</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-nexus-text-muted hover:text-nexus-text transition-colors p-1"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-nexus-surface-3 text-nexus-text-secondary' 
                      : 'bg-nexus-cyan/10 text-nexus-cyan'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-nexus-surface-2 text-nexus-text border border-nexus-border rounded-tr-sm'
                      : 'bg-nexus-cyan/10 text-nexus-text border border-nexus-cyan/20 rounded-tl-sm'
                  }`}>
                    {msg.image && (
                      <div className="mb-2 max-w-[200px] rounded-lg overflow-hidden border border-nexus-cyan/30">
                        <img src={msg.image} alt="Uploaded attachment" className="w-full h-auto" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.tool_called && (
                      <div className="mt-2 text-[10px] font-mono text-nexus-cyan/70 bg-nexus-cyan/5 px-2 py-1 rounded inline-block">
                        ⚡ Action executed: {msg.tool_called}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 flex-row"
                >
                  <div className="w-8 h-8 rounded-full bg-nexus-cyan/10 text-nexus-cyan flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-nexus-cyan/5 border border-nexus-cyan/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-nexus-cyan animate-spin" />
                    <span className="text-xs text-nexus-cyan animate-pulse">Processing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-nexus-surface border-t border-nexus-border">
              <div className="flex items-center gap-2 bg-nexus-surface-2 rounded-xl border border-nexus-border focus-within:border-nexus-cyan/50 transition-colors p-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask NEXUS or request an action..."
                  className="flex-1 px-4 py-2.5 bg-transparent text-nexus-text placeholder:text-nexus-text-muted focus:outline-none text-sm"
                  disabled={isTyping}
                  autoFocus
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 mr-1 rounded-lg bg-gradient-to-r from-nexus-cyan to-nexus-blue text-white disabled:opacity-50 hover:shadow-lg hover:shadow-nexus-cyan/20 transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
