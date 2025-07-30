export interface ChatMessage {
  text: string;
  isUser: boolean;
  id: string;
  timestamp?: string;
  chatId?: string;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  lastTimestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Интерфейсы для серверных данных
export interface ServerMessage {
  id: number;
  chat_id: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
  updated_at: string;
}

export interface ServerChat {
  id: number;
  user_id: number;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  messages: ServerMessage[];
} 