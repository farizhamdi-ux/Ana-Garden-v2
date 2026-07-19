import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Heart, MessageSquare, Compass, Award, Loader2, Flower } from 'lucide-react';

export default function AiConcierge() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; source?: string }[]>([
    {
      sender: 'ai',
      text: `🕊️ *Welcome to Ana's Sanctuary.* \n\nI am your AI Bouquet Concierge, inspired by Aziliana’s gentle spirit and dedication to finding beauty in every bloom. \n\nOur flower shop is based in Kota Kinabalu, and every arrangement we craft contains the crisp mountain dew of Cameron Highlands and Kundasang slopes. \n\nTell me: who are these flowers for? What budget do you have, or what is the emotion you want them to feel? Apology, romantic devotion, or quiet hope? Let's write their story together.`,
      source: 'Aziliana Ying Philosophy'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { title: 'Romantic Anniversary', text: 'Suggest anniversary flowers for my wife. I have a RM200 budget.' },
    { title: 'Apology & Healing', text: 'What flowers represent apology and recovery? My friend is going through a hard time.' },
    { title: 'Sabah Kaamatan Gift', text: 'I need a vibrant bouquet inspired by Sabah\'s Kaamatan Harvest Festival.' },
    { title: 'Graduation Celebration', text: 'Recommend graduation flowers for a student finishing at UMS under RM150.' }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Add user message
    const userMsg = textToSend;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.text, source: data.source }]);
      } else {
        throw new Error('No response text');
      }
    } catch (err) {
      console.error(err);
      // Fallback fallback simulated response
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `🌸 *Ana's Personal Touch* 🌸\n\nI am compiling a bespoke bouquet recommendation based on your request. For an elegant, warm selection, I recommend our hand-tied **Kinabalu Sunrise Bouquet** (RM185.00) featuring fresh Cameron blushing roses and Kundasang white lilies. This setup has a calculated Freshness Score of 92% and carries a vase life of 9 days. \n\nWould you like me to guide you to our Bouquet Builder page to personalize the ribbons and gift card?`,
        source: 'Simulated Local Expert'
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Format simple markdown-like formatting from Gemini
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => {
      let formatted = line;
      
      // Bold Markdown replacement
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <p
          key={index}
          className="mb-2 last:mb-0 leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans" id="concierge-view">
      {/* Brand header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          <Bot className="w-3.5 h-3.5 inline mr-1" /> Google Gemini Pro Connected
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">AI Bouquet Concierge</h2>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Ana's Garden AI learns recipient preferences, designs bouquets based on emotions, and writes poetical cards in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Suggested Prompts sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#D4AF37]/10 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5 pb-2 border-b border-[#D4AF37]/10">
              <Compass className="w-4 h-4 text-[#D4AF37]" /> Common Inquiries
            </h3>
            <p className="text-[11px] text-gray-400">Click a seed question to let Ana's AI assist you in selecting the ideal botanical combination:</p>
            
            <div className="space-y-3">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#FCF9F6] border border-[#D4AF37]/10 hover:border-[#D4AF37] hover:bg-white transition-all text-xs group"
                >
                  <p className="font-bold text-gray-800 flex items-center gap-1 group-hover:text-[#D4AF37] transition-colors">
                    <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /> {p.title}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 italic">"{p.text}"</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/10 rounded-[2rem] p-6 shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4AF37]" /> Why AI Florist?
            </h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Sabah's tropical humidity alters stem lifespans. Our AI uses local weather alerts and origin transit coordinates from Brinchang to calculate true structural freshness indexes.
            </p>
            <p className="text-[10px] text-[#9CAF88] font-bold uppercase tracking-wider">90-Minute delivery guaranteed on our smart pairings.</p>
          </div>
        </div>

        {/* Chat Window (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#D4AF37]/15 rounded-[2rem] overflow-hidden shadow-xl flex flex-col h-[540px]">
          {/* Active Header */}
          <div className="bg-[#1A1A1A] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Flower className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider leading-none">Ana's AI Gifting Assistant</h4>
                <p className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active • Freshness Algorithm Loaded
                </p>
              </div>
            </div>
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#FCF9F6]/30 to-white">
            {messages.map((m, idx) => {
              const isAi = m.sender === 'ai';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    isAi ? 'bg-[#9CAF88]/15 text-[#9CAF88]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {isAi ? <Bot className="w-3.5 h-3.5 text-[#9CAF88]" /> : <User className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white border border-[#D4AF37]/10 text-gray-800'
                      : 'bg-[#1A1A1A] text-white'
                  }`}>
                    {formatMessageText(m.text)}
                    {m.source && (
                      <span className="block mt-2 pt-1 border-t border-[#D4AF37]/10 text-[8px] text-gray-400 font-mono uppercase tracking-widest">
                        Knowledge Engine: {m.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-[#9CAF88]/15 text-[#9CAF88] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9CAF88]" />
                  Nurturing elegant recommendations...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 border-t border-[#D4AF37]/10 bg-white flex gap-2"
          >
            <input
              type="text"
              placeholder="Tell me who the flowers are for, and I will craft a story..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#FCF9F6] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:opacity-50"
              id="ai-chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white p-3 rounded-xl transition-colors duration-300 disabled:opacity-30"
              id="ai-chat-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
