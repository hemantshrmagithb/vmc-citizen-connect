
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] px-3 py-2 rounded-lg shadow-sm relative ${
          isUser 
            ? 'bg-[#dcf8c6] rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        }`}
      >
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <div className="flex items-center justify-end mt-1 gap-1">
          <span className="text-[10px] text-gray-500 uppercase">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <span className={`text-[10px] ${message.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`}>
              <i className="fas fa-check-double"></i>
            </span>
          )}
        </div>
        
        {/* Tail decoration */}
        <div 
          className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
            isUser 
              ? 'right-[-6px] border-l-[#dcf8c6] border-t-[#dcf8c6]' 
              : 'left-[-6px] border-r-white border-t-white'
          }`}
        />
      </div>
    </div>
  );
};

export default MessageBubble;
