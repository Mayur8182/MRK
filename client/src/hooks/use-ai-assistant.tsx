import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest('POST', '/api/ai-assistant/chat', {
        message,
        history: messages.slice(-10), // Send only the last 10 messages for context
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to get response from AI assistant');
      }
      
      return await res.json();
    },
    onMutate: (message) => {
      // Optimistically add user message to UI
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
    },
    onSuccess: (data) => {
      // Add assistant response to messages
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      toast({
        title: 'AI Assistant Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const sendMessage = (message: string) => {
    if (message.trim() === '') return;
    setIsVisible(true); // Always show the assistant when sending a message
    chatMutation.mutate(message);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: chatMutation.isPending,
    isVisible,
    toggleVisibility,
  };
}