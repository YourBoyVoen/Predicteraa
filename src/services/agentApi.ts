import { httpClient } from './httpClient';

// Types
export interface ChatMessage {
  id: number;
  conversation_id?: number;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  user_id: string;
  title: string | null;
  message_count: number;
  last_message: string;
  created_at: string;
  updated_at: string;
}

export interface SendMessagePayload {
  message: string;
  conversation_id?: number;
}

export interface SendMessageResponse {
  status: string;
  data: {
    response: string;
    conversation_id: number;
    sources: string[];
  };
}

export interface ConversationsResponse {
  status: string;
  data: {
    conversations: Conversation[];
  };
}

export interface ConversationMessagesResponse {
  status: string;
  data: {
    conversation_id: number;
    messages: ChatMessage[];
  };
}

export interface DeleteConversationResponse {
  status: string;
  message: string;
}

// API methods
export const agentApi = {
  // POST /api/agent/chat - Send a message to the AI agent
  sendMessage: async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    return httpClient.post<SendMessageResponse>('/api/agent/chat', payload);
  },

  // GET /api/agent/conversations - Get all conversations for the user
  getConversations: async (): Promise<ConversationsResponse> => {
    return httpClient.get<ConversationsResponse>('/api/agent/conversations');
  },

  // GET /api/agent/conversations/{conversationId} - Get messages for a conversation
  getConversationMessages: async (conversationId: number, limit?: number): Promise<ConversationMessagesResponse> => {
    const query = limit ? `?limit=${limit}` : '';
    return httpClient.get<ConversationMessagesResponse>(`/api/agent/conversations/${conversationId}${query}`);
  },

  // DELETE /api/agent/conversations/{conversationId} - Delete a conversation
  deleteConversation: async (conversationId: number): Promise<DeleteConversationResponse> => {
    return httpClient.delete<DeleteConversationResponse>(`/api/agent/conversations/${conversationId}`);
  },
};
