import { createContext, ReactNode, useContext } from 'react';
import { useAIAssistant, type ChatMessage } from './use-ai-assistant';

interface AIAssistantContextType {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const assistantState = useAIAssistant();
  
  return (
    <AIAssistantContext.Provider value={assistantState}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistantContext() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistantContext must be used within an AIAssistantProvider');
  }
  return context;
}