/**
 * AI Assistant domain types
 */
import { BaseEntity } from '../common.types';

export interface Chat extends BaseEntity {
  userId: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
  metadata?: ChatMetadata;
}

export interface ChatMessage extends BaseEntity {
  chatId: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  metadata?: MessageMetadata;
  attachments?: MessageAttachment[];
}

export interface ChatMetadata {
  context?: string;
  userAgent?: string;
  sessionId?: string;
  tags?: string[];
}

export interface MessageMetadata {
  processingTime?: number;
  model?: string;
  confidence?: number;
  intent?: string;
  entities?: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export type AttachmentType = 'image' | 'document' | 'audio' | 'video';

// AI Assistant state
export interface AIAssistantState {
  isOpen: boolean;
  currentChat: Chat | null;
  chats: Chat[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

// Message requests
export interface SendMessageRequest {
  chatId?: string;
  content: string;
  attachments?: File[];
  context?: {
    page?: string;
    productId?: string;
    orderId?: string;
  };
}

export interface SendMessageResponse {
  message: ChatMessage;
  chatId: string;
  suggestions?: string[];
}
