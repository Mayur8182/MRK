import { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '@/hooks/use-ai-assistant';
import { useAIAssistantContext } from '@/hooks/ai-assistant-provider';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Send, 
  Bot, 
  User, 
  X, 
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';

export function AIAssistant() {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    clearMessages, 
    isLoading,
    isVisible,
    toggleVisibility
  } = useAIAssistantContext();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when assistant is opened
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  // If the assistant isn't visible, just show the toggle button
  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={toggleVisibility} 
          size="lg" 
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-4 z-50 w-96 flex flex-col">
      <Card className="shadow-xl border-t-4 border-t-primary mb-1">
        <CardHeader className="p-3 flex flex-row justify-between items-center space-y-0">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Investment AI Assistant</h3>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={clearMessages}
              title="Clear conversation"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleVisibility}
              title="Minimize"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleVisibility}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                <Bot className="h-12 w-12 mb-4 text-primary/30" />
                <h3 className="font-medium text-lg mb-2">How can I help you today?</h3>
                <p className="text-sm">
                  I can provide market analysis, investment recommendations, risk assessments, and answer questions about your portfolio.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessageItem key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-3 pt-2">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Textarea 
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about markets, risk analysis, or recommendations..."
              className="min-h-[40px] resize-none"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || inputValue.trim() === ''}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        flex gap-2 max-w-[85%] group
        ${message.role === 'user' ? 'flex-row-reverse' : ''}
      `}>
        <div className={`
          flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
          ${message.role === 'user' 
            ? 'bg-primary/10 text-primary' 
            : 'bg-secondary text-secondary-foreground'}
        `}>
          {message.role === 'user' 
            ? <User className="h-4 w-4" /> 
            : <Bot className="h-4 w-4" />}
        </div>
        
        <div className={`
          py-2 px-3 rounded-2xl
          ${message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'}
        `}>
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div className={`
            text-[10px] mt-1 opacity-70
            ${message.role === 'user' ? 'text-right' : ''}
          `}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}