
import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-[#075e54] text-white p-3 flex items-center shadow-md sticky top-0 z-10 h-16">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
          <img 
            src="https://vmc.gov.in/VMC_Logo.png" 
            alt="VMC Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/vmc/40/40";
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">VMC Citizen Connect</h1>
          <p className="text-xs text-green-200">Online | official Chatbot</p>
        </div>
      </div>
      <div className="ml-auto flex gap-4 text-xl opacity-90">
        <button className="hover:opacity-70 transition-opacity"><i className="fas fa-video"></i></button>
        <button className="hover:opacity-70 transition-opacity"><i className="fas fa-phone"></i></button>
        <button className="hover:opacity-70 transition-opacity"><i className="fas fa-ellipsis-v"></i></button>
      </div>
    </div>
  );
};

export default ChatHeader;
