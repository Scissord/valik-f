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
} 