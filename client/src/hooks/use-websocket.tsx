import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface WebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

interface MarketData {
  indices: {
    [key: string]: { value: number; change: number };
  };
  topMovers: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
  }>;
  sectorPerformance: Array<{
    name: string;
    change: number;
  }>;
}

export function useWebSocket(options?: WebSocketOptions) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Function to send messages to the WebSocket server
  const sendMessage = useCallback((data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  // Connect to the WebSocket server
  useEffect(() => {
    if (!user) {
      // Clean up existing connection when user logs out
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Send authentication message
      sendMessage({
        type: 'auth',
        userId: user.id
      });
      
      options?.onOpen?.();
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      options?.onClose?.();
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to market data stream. Please refresh the page.',
        variant: 'destructive',
      });
      options?.onError?.(error);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'auth_success':
            console.log('WebSocket authentication successful');
            break;
            
          case 'market_data':
            setMarketData(message.data);
            setLastUpdate(new Date(message.timestamp));
            break;
            
          case 'portfolio_update':
            // Handle portfolio updates
            toast({
              title: 'Portfolio Updated',
              description: message.message,
            });
            break;
            
          case 'alert':
            // Handle custom alerts
            toast({
              title: message.title || 'Market Alert',
              description: message.message,
              variant: message.variant || 'default',
            });
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Clean up function
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, options, toast, sendMessage]);

  return {
    isConnected,
    marketData,
    lastUpdate,
    sendMessage,
  };
}