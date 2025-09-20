'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { getToken } from '@/lib/user-provider';
import { useRouter } from 'next/navigation';

// Type definitions for socket.io-client (to avoid import errors before installation)
interface Socket {
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  rooms: Set<string>;
  connected: boolean;
  id: string;
}

interface SocketIOStatic {
  (uri?: string, opts?: any): Socket;
}

// Dynamic import for socket.io-client
let io: SocketIOStatic | null = null;

async function getSocketIO(): Promise<any> {
  if (!io) {
    try {
      // @ts-ignore - Dynamic import for optional dependency
      const socketModule = await import('socket.io-client');
      io = socketModule.io as any;
    } catch (error) {
      console.error(
        'socket.io-client not installed. Please run: npm install socket.io-client'
      );
      throw new Error('socket.io-client not installed');
    }
  }
  return io!;
}

export interface WebSocketChatSession {
  id: number;
  customer_id?: number;
  guest_name: string;
  status_session: 'OPEN' | 'CLOSED';
  session_key: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface WebSocketChatMessage {
  id: number;
  chat_session_id: number;
  sender_type: 'CUS' | 'EMP';
  sender_id?: number;
  message: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface UseGlobalChatProps {
  serverUrl?: string;
}

interface UseGlobalChatReturn {
  isConnected: boolean;
  error: string | null;
}

export function useGlobalChat({
  serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL,
}: UseGlobalChatProps = {}): UseGlobalChatReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<WebSocketChatSession[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const initializeSocket = async () => {
      console.log('Initializing global chat socket');
      try {
        const authToken = await getToken();
        if (!authToken) {
          console.log('No auth token available for global chat');
          return;
        }

        // Prevent duplicate initialization
        if (isInitializedRef.current || socket) {
          console.log(
            'Global chat socket already initialized or exists, skipping...'
          );
          return;
        }

        const ioClient = await getSocketIO();

        // Use query parameters for authentication (most reliable method)
        const socketInstance = ioClient(serverUrl, {
          query: {
            token: authToken, // Pass token as query parameter
          },
          transports: ['websocket', 'polling'], // Allow polling fallback
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          upgrade: true,
        });

        // Connection event handlers
        socketInstance.on('connect', () => {
          console.log('Global chat socket connected');
          setIsConnected(true);
          setError(null);
        });

        socketInstance.on('disconnect', (reason: string) => {
          console.log('Global chat socket disconnected:', reason);
          setIsConnected(false);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            socketInstance.connect();
          }
        });

        socketInstance.on('connect_error', (err: any) => {
          console.error('Global chat WebSocket connection error:', err);
          setError(`Connection error: ${err.message || 'Failed to connect'}`);
          setIsConnected(false);
        });

        socketInstance.on('reconnect', (attemptNumber: number) => {
          console.log(
            'Reconnected to global chat WebSocket server, attempt:',
            attemptNumber
          );
          setIsConnected(true);
          setError(null);
        });

        socketInstance.on('reconnect_error', (err: any) => {
          console.error('Global chat WebSocket reconnection error:', err);
          setError(`Reconnection failed: ${err.message || 'Unknown error'}`);
        });

        // Handle all sessions response
        socketInstance.on(
          'all_sessions',
          (sessions: WebSocketChatSession[]) => {
            console.log('Received sessions from global chat:', sessions);
            setSessions(sessions);
          }
        );

        // Handle new message - this is the key part for global notifications
        socketInstance.on('new_message', (message: WebSocketChatMessage) => {
          console.log('New message received in global chat:', message);
          // Fallback if session not found in current sessions
          toast.warning('New message received', {
            position: 'bottom-right',
            description: message.message,
            duration: 5000,
            action: {
              label: 'View Chat',
              onClick: () => router.push('/live-chat'),
            },
          });
        });

        // Handle new session from admin room
        socketInstance.on(
          'new_session',
          (sessionData: {
            sessionId: number;
            customerId: string;
            guestName: string;
            status: 'OPEN' | 'CLOSED';
            createdAt: string;
          }) => {
            console.log('New session received in global chat:', sessionData);

            // Add the new session to the sessions list
            const newSession: WebSocketChatSession = {
              id: sessionData.sessionId,
              customer_id: parseInt(sessionData.customerId),
              guest_name: sessionData.guestName,
              status_session: sessionData.status,
              session_key: `session_${sessionData.sessionId}`,
              created_at: sessionData.createdAt,
              updated_at: sessionData.createdAt,
              deleted_at: undefined,
            };

            setSessions((prev) => {
              // Check if session already exists to avoid duplicates
              const exists = prev.some(
                (session) => session.id === sessionData.sessionId
              );
              if (exists) {
                return prev.map((session) =>
                  session.id === sessionData.sessionId ? newSession : session
                );
              }
              return [newSession, ...prev];
            });
          }
        );

        setSocket(socketInstance);
        isInitializedRef.current = true;

        // Cleanup on unmount
        return () => {
          console.log('Cleaning up global chat socket connection');
          isInitializedRef.current = false;
          socketInstance.removeAllListeners();
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize global chat WebSocket:', error);
        setError(
          'Failed to load global chat WebSocket client. Please install socket.io-client.'
        );
      }
    };

    initializeSocket();
  }, [serverUrl]);

  // Fetch sessions via WebSocket event
  const fetchSessions = useCallback(async () => {
    if (!socket || !isConnected) {
      console.log('Cannot fetch sessions: WebSocket not connected');
      return;
    }

    setError(null);

    try {
      console.log('Requesting all sessions via WebSocket...');
      socket.emit('get_all_sessions');
    } catch (error) {
      console.error('Error requesting sessions:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to request sessions'
      );
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchSessions();
    }
  }, [isConnected, fetchSessions]);

  return {
    isConnected,
    error,
  };
}
