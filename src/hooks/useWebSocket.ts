'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (url: string | null, options: UseWebSocketOptions = {}) => {
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const mountedRef = useRef(true);
  
  // Сохраняем callback'и в ref чтобы избежать пересоздания
  const onMessageRef = useRef(options.onMessage);
  const onOpenRef = useRef(options.onOpen);
  const onCloseRef = useRef(options.onClose);
  const onErrorRef = useRef(options.onError);
  
  useEffect(() => {
    onMessageRef.current = options.onMessage;
    onOpenRef.current = options.onOpen;
    onCloseRef.current = options.onClose;
    onErrorRef.current = options.onError;
  }, [options.onMessage, options.onOpen, options.onClose, options.onError]);

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) {
      return;
    }
    
    // Если уже подключены, не переподключаемся
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('⚠️ Already connected, skipping reconnect');
      return;
    }
    
    // Если уже идет подключение, не создаем новое
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('⚠️ Already connecting, skipping');
      return;
    }

    setIsConnecting(true);

    try {
      console.log('🔌 Attempting to connect to WebSocket:', url);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        onOpenRef.current?.();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        console.log('📨 RAW WebSocket message received:', event.data);
        console.log('📨 Message type:', typeof event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('📨 PARSED WebSocket data:', data);
          onMessageRef.current?.(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          console.log('📨 Raw message (not JSON):', event.data);
          // Если это не JSON, передаем как есть
          onMessageRef.current?.(event.data);
        }
      };

      ws.onerror = (error) => {
        if (!mountedRef.current) return;
        console.error('❌ WebSocket error:', error);
        console.log('WebSocket readyState:', ws.readyState);
        console.log('WebSocket URL:', ws.url);
        setIsConnecting(false);
        onErrorRef.current?.(error);
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        console.log('🔌 WebSocket disconnected');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason);
        console.log('Was clean:', event.wasClean);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        onCloseRef.current?.();

        // Попытка переподключения только если компонент еще смонтирован
        if (mountedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`🔄 Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log('❌ Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setIsConnecting(false);
    }
  }, [url, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(data);
      console.log('📤 Sending to WebSocket:', messageStr);
      wsRef.current.send(messageStr);
      return true;
    }
    console.warn('⚠️ WebSocket is not connected. ReadyState:', wsRef.current?.readyState);
    return false;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (url) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        // Устанавливаем флаг что это намеренное закрытие
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [url, connect]); // Теперь connect стабильный

  return {
    sendMessage,
    isConnected,
    isConnecting,
    connect,
    disconnect
  };
};
