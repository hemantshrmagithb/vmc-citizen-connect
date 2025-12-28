
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  language: 'English' | 'Gujarati' | 'Hindi';
}
