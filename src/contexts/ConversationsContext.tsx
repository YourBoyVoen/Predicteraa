import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { agentApi, type Conversation } from '../services';

interface ConversationsContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refreshConversations: () => Promise<void>;
  deleteConversation: (id: number) => Promise<void>;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};

interface ConversationsProviderProps {
  children: ReactNode;
}

export const ConversationsProvider: React.FC<ConversationsProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.getConversations();
      setConversations(response.data.conversations);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: number) => {
    try {
      await agentApi.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Failed to delete conversation:', err);
    }
  };

  const refreshConversations = async () => {
    await loadConversations();
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const value: ConversationsContextType = {
    conversations,
    loading,
    error,
    refreshConversations,
    deleteConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};