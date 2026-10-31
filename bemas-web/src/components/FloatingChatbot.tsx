import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ChefHat,
  Bot,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, User } from '../types';
import {
  sendAgentMessage,
  formatChatTime,
  INITIAL_CHAT_SUGGESTIONS
} from '../services/agentChat';

interface FloatingChatbotProps {
  currentUser?: User | null;
  defaultOpen?: boolean;
  onNavigateToRecipe?: () => void;
  onNavigateToMap?: () => void;
}

export function FloatingChatbot({
  currentUser,
  defaultOpen = false,
  onNavigateToRecipe,
  onNavigateToMap
}: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasUnreadIndicator, setHasUnreadIndicator] = useState(false);

  // Initial welcome message
  const createInitialMessage = (): ChatMessage => ({
    id: 'msg-welcome-0',
    sender: 'agent',
    text: `Halo ${currentUser ? currentUser.name : 'Sobat Dapur'}! 👋 Saya **Chef AI BEMAS**, asisten kuliner pribadi Anda.\n\nBingung mau masak apa dari bahan yang ada di kulkas? Mau tahu perbandingan masak vs beli, takaran bahan, tips dapur, atau nilai gizi hidangan? Tanyakan saja pada saya!`,
    timestamp: formatChatTime(),
    suggestions: INITIAL_CHAT_SUGGESTIONS
  });

  const [messages, setMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadIndicator(false);
      // Auto-focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isThinking]);

  // Handle sending a message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatChatTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const replyText = await sendAgentMessage(text, messages);
      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: formatChatTime()
      };
      setMessages(prev => [...prev, agentMsg]);
      if (!isOpen) {
        setHasUnreadIndicator(true);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-agent-err-${Date.now()}`,
        sender: 'agent',
        text: 'Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali sesaat lagi.',
        timestamp: formatChatTime()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([createInitialMessage()]);
    setInputMessage('');
    setIsThinking(false);
  };

  // Render markdown-like simple formatting (bold, newlines, bullet points)
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-[#1E1715]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {line.trim().startsWith('•') || line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') ? (
            <span className="block pl-1 my-0.5">{formattedLine}</span>
          ) : (
            <span>{formattedLine}</span>
          )}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON (FAB) */}
      <div
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2"
        role="region"
        aria-label="Tombol Chat Asisten AI"
      >
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#1E1715] text-xs font-semibold rounded-full shadow-lg border border-[#F0E5E1] cursor-pointer hover:border-[#FF5722] hover:text-[#FF5722] transition-all transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-right-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Tanya Chef AI</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`relative group p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30 ${
            isOpen
              ? 'bg-[#1E1715] text-white hover:bg-[#322724] rotate-90'
              : 'bg-[#FF5722] text-white hover:bg-[#E64A19] hover:scale-105'
          }`}
          aria-label={isOpen ? 'Tutup Jendela Chat' : 'Buka Chat Asisten BEMAS'}
          title={isOpen ? 'Tutup Chat' : 'Buka Chat dengan Chef AI BEMAS'}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {hasUnreadIndicator && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* 2. DEDICATED CHAT OVERLAY WINDOW (SYSTEM OVERLAY) */}
      {isOpen && (
        <section
          aria-label="Jendela Chat Asisten AI BEMAS"
          className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[550px] max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-[#F0E5E1] overflow-hidden transition-all duration-300 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-5"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* HEADER JENDELA CHAT */}
          <header className="px-4 py-3.5 bg-[#FFF8F6] border-b border-[#F0E5E1] flex items-center justify-between gap-3 select-none flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white shadow-md">
                  <ChefHat className="w-5 h-5" />
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                  title="Chef AI sedang online"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-[#1E1715] text-sm truncate flex items-center gap-1.5">
                  Chef AI BEMAS
                  <span className="px-1.5 py-0.5 bg-orange-100 text-[#FF5722] text-[10px] font-bold rounded-md">
                    Agen
                  </span>
                </h3>
                <p className="text-[11px] text-[#786C68] truncate flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Asisten Kuliner Pribadi • Siap Membantu
                </p>
              </div>
            </div>

            {/* Tombol Aksi Header */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-[#786C68] hover:text-[#1E1715] hover:bg-white rounded-lg transition-colors"
                title="Mulai Ulang Obrolan"
                aria-label="Mulai Ulang Obrolan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#786C68] hover:text-[#FF5722] hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Tutup Chat"
                aria-label="Tutup Chat"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Tutup</span>
              </button>
            </div>
          </header>

          {/* AREA PERCAKAPAN (CONVERSATION STREAM) */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FFFBF9] via-white to-[#FFFBF9] text-xs leading-relaxed"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, index) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[88%] ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar Bubble */}
                    <div className="flex-shrink-0 mb-1">
                      {isAgent ? (
                        <div className="w-7 h-7 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#1E1715] text-white flex items-center justify-center text-[10px] shadow-xs">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Chat Bubble Body */}
                    <div
                      className={`rounded-2xl p-3.5 shadow-xs transition-all ${
                        isAgent
                          ? 'bg-white border border-[#F0E5E1] text-[#2C201C] rounded-bl-xs'
                          : 'bg-[#FF5722] text-white rounded-br-xs shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {renderMessageContent(msg.text)}
                      </div>

                      {/* Saran Cepat jika ada di pesan awal */}
                      {isAgent && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#F5EBE7] space-y-1.5">
                          <p className="text-[10px] font-bold text-[#786C68] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FF5722]" /> Saran Pertanyaan Cepat:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestions.map((sug, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleSendMessage(sug)}
                                className="text-left text-[11px] font-medium px-2.5 py-1 bg-[#FFF5F2] hover:bg-[#FFEAE4] text-[#E64A19] rounded-lg border border-[#FFDCD3] transition-colors active:scale-95"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div
                        className={`text-[9px] mt-1.5 flex items-center justify-end ${
                          isAgent ? 'text-[#9E8E89]' : 'text-white/80'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bouncing Typing Indicator */}
            {isThinking && (
              <div className="flex items-end gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#F0E5E1] rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-bounce"></div>
                  <span className="text-[11px] text-[#786C68] ml-2">Chef AI sedang meracik jawaban...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AREA INPUT (Terletak di bagian paling bawah) */}
          <footer className="p-3 bg-white border-t border-[#F0E5E1] flex-shrink-0">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Tanyakan resep, bahan, gizi, atau tips koki..."
                disabled={isThinking}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E0D3CE] focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 bg-[#FFFBF9] text-[#1E1715] placeholder:text-[#A0938E] disabled:opacity-60 transition-all"
                aria-label="Ketik pesan untuk Chef AI"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isThinking}
                className="px-3.5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Kirim Pesan"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="font-semibold">Kirim</span>
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#9E8E89] px-1">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-[#FF5722]" /> Tekan <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono text-[9px]">Enter</kbd> untuk mengirim
              </span>
              {(onNavigateToRecipe || onNavigateToMap) && (
                <div className="flex items-center gap-2 font-medium">
                  {onNavigateToRecipe && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateToRecipe();
                      }}
                      className="hover:text-[#FF5722] underline"
                    >
                      Buka Resep AI
                    </button>
                  )}
                  {onNavigateToMap && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateToMap();
                      }}
                      className="hover:text-[#FF5722] underline"
                    >
                      Buka Kuliner
                    </button>
                  )}
                </div>
              )}
            </div>
          </footer>
        </section>
      )}
    </>
  );
}

export default FloatingChatbot;
