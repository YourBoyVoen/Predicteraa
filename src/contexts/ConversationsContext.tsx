import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
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

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.getConversations();
      const sortedConversations = response.data.conversations
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setConversations(sortedConversations);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  const deleteConversation = useCallback(async (id: number) => {
    try {
      await agentApi.deleteConversation(id);
      await refreshConversations();
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Failed to delete conversation:', err);
    }
  }, [refreshConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const value = useMemo<ConversationsContextType>(() => ({
    conversations,
    loading,
    error,
    refreshConversations,
    deleteConversation,
  }), [conversations, loading, error, refreshConversations, deleteConversation]);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};