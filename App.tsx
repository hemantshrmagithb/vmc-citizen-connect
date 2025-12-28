
import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatState } from './types';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Namaste! 🙏 Welcome to VMC Citizen Connect. I am your automated assistant for Vadodara Municipal Corporation. \n\nI can help you with:\n✅ Property Tax Bills\n✅ Water & Garbage Issues\n✅ Registering Complaints\n✅ Certificate Information\n\nHow can I assist you today? (You can reply in English, Gujarati, or Hindi)",
        timestamp: new Date(),
        status: 'read'
      }
    ],
    isTyping: false,
    language: 'English'
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || state.isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sent'
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));
    setInput('');

    // Simulate network delay for "delivered" status
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === userMessage.id ? { ...m, status: 'delivered' } : m)
      }));
    }, 500);

    const responseText = await getGeminiResponse([...state.messages, userMessage]);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isTyping: false
    }));
  };

  const quickActions = [
    "Property Tax 💸",
    "Garbage Help 🚛",
    "Complaint Status 📄",
    "Emergency 📞"
  ];

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white shadow-2xl relative overflow-hidden">
      <ChatHeader />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto whatsapp-bg p-4 pb-20">
        {state.messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {state.isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-transparent pointer-events-none">
        {/* Quick Actions Scroll - only if not typing */}
        {!state.isTyping && state.messages.length < 10 && (
           <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pointer-events-auto px-2">
           {quickActions.map((action, i) => (
             <button 
               key={i}
               onClick={() => { setInput(action); handleSendMessage(); }}
               className="whitespace-nowrap bg-white text-[#075e54] text-xs font-semibold px-4 py-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
             >
               {action}
             </button>
           ))}
         </div>
        )}

        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 pointer-events-auto"
        >
          <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-lg border border-gray-100">
            <button type="button" className="text-gray-400 text-xl mr-2">
              <i className="far fa-smile"></i>
            </button>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 outline-none text-sm py-1"
            />
            <button type="button" className="text-gray-400 text-xl ml-2 rotate-45">
              <i className="fas fa-paperclip"></i>
            </button>
            <button type="button" className="text-gray-400 text-xl ml-4">
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <button 
            type="submit"
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${
              input.trim() ? 'bg-[#00a884]' : 'bg-[#075e54]'
            }`}
          >
            {input.trim() ? (
              <i className="fas fa-paper-plane"></i>
            ) : (
              <i className="fas fa-microphone"></i>
            )}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default App;
