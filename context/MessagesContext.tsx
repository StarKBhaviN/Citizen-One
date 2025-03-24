import React, { createContext, useState, useContext, ReactNode } from 'react';
import { messagesAPI } from './api';

// Define types
type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  // Add other message properties
};

type Conversation = {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  // Add other conversation properties
};

type MessagesContextType = {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  getConversations: () => Promise<void>;
  getConversation: (id: string) => Promise<void>;
  createConversation: (conversationData: any) => Promise<any>;
  getMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, messageData: any) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  clearError: () => void;
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const getConversation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagesAPI.getConversation(id);
      setCurrentConversation(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch conversation details');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (conversationData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagesAPI.createConversation(conversationData);
      setConversations([res.data.data, ...conversations]);
      return res.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create conversation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagesAPI.getMessages(conversationId);
      setMessages(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, messageData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagesAPI.sendMessage(conversationId, messageData);
      setMessages([...messages, res.data.data]);
      
      // Update the conversation in the list with the new last message
      const updatedConversations = conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: res.data.data.text
          };
        }
        return c;
      });
      
      setConversations(updatedConversations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (conversationId: string) => {
    setError(null);
    try {
      await messagesAPI.markAsRead(conversationId);
      
      // Update the conversation in the list to set unread count to 0
      const updatedConversations = conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadCount: 0
          };
        }
        return c;
      });
      
      setConversations(updatedConversations);
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation({
          ...currentConversation,
          unreadCount: 0
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark messages as read');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        loading,
        error,
        getConversations,
        getConversation,
        createConversation,
        getMessages,
        sendMessage,
        markAsRead,
        clearError,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
