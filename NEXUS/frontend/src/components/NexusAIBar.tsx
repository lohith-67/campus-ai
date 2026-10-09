import { motion } from 'framer-motion';
import { MessageSquareText, Upload, Mic, Send, Bot, Loader2, StopCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { ChatModal } from './ChatModal';

interface NexusAIBarProps {
  title?: string;
  placeholder?: string;
  suggestedPrompts?: { text: string; icon?: any }[];
}

export function NexusAIBar({
  title = "NEXUS AI Assistant",
  placeholder = "Tell NEXUS what you need...",
  suggestedPrompts = []
}: NexusAIBarProps) {
  const [query, setQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { isListening, transcript, startListening, stopListening, supported } = useSpeechRecognition();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isListening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  const handleOpenChat = (text: string) => {
    setInitialChatQuery(text);
    setIsChatOpen(true);
    if (text === query) setQuery('');
  };

  const handleVoiceToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpg, png, webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <motion.div
        className="glass rounded-2xl p-5 glow-cyan cursor-text relative overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) inputRef.current?.focus();
        }}
      >
        {isListening && <div className="absolute inset-0 bg-nexus-cyan/5 pointer-events-none animate-pulse" />}

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-nexus-cyan" />
            <span className="text-sm font-medium text-nexus-text">{title}</span>
          </div>
          {isListening && (
            <div className="flex items-center gap-2 text-xs text-nexus-cyan animate-pulse">
              <span className="w-2 h-2 rounded-full bg-nexus-cyan" /> Listening...
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="mb-3 relative z-10 flex items-start gap-2">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-nexus-cyan/30">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center text-white text-[10px]"
              >✕</button>
            </div>
            <span className="text-xs text-nexus-cyan">Image attached</span>
          </div>
        )}

        <div className={`relative z-10 flex items-center gap-2 rounded-xl border transition-colors ${isListening ? 'bg-nexus-cyan/10 border-nexus-cyan/50' : 'bg-nexus-surface-2 border-nexus-border focus-within:border-nexus-cyan/50'}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (query.trim() || selectedImage)) handleOpenChat(query);
            }}
            placeholder={isListening ? "Listening..." : placeholder}
            className="flex-1 px-4 py-3 bg-transparent text-nexus-text placeholder:text-nexus-text-muted focus:outline-none text-sm"
          />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-nexus-text-muted hover:text-nexus-text transition-colors" 
            title="Upload image"
          >
            <Upload className="w-4 h-4" />
          </button>
          
          {supported && (
            <button 
              onClick={handleVoiceToggle}
              className={`p-2 transition-colors ${isListening ? 'text-nexus-cyan' : 'text-nexus-text-muted hover:text-nexus-text'}`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => {
              if (query.trim() || selectedImage) handleOpenChat(query);
            }}
            className="p-2 mr-1 text-nexus-cyan hover:text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {suggestedPrompts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 relative z-10">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleOpenChat(prompt.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nexus-surface-3 border border-nexus-border text-xs text-nexus-text-secondary hover:text-nexus-text hover:border-nexus-cyan/30 transition-all"
              >
                {prompt.icon && <prompt.icon className="w-3 h-3" />}
                {prompt.text}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => {
          setIsChatOpen(false);
          setSelectedImage(null);
        }} 
        initialQuery={initialChatQuery}
        initialImage={selectedImage}
      />
    </>
  );
}
