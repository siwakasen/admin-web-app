'use client';

import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { toast } from 'sonner';

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

let io: SocketIOStatic | null = null;

async function getSocketIO(): Promise<any> {
  if (!io) {
    try {
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

interface UseWebSocketChatReturn {
  socket: Socket | null;
  isConnected: boolean;
  messages: WebSocketChatMessage[];
  sessions: WebSocketChatSession[];
  joinSession: (chatSessionId: number) => void;
  sendMessage: (chatSessionId: number, message: string) => void;
  fetchSessions: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
  isLoadingSessions: boolean;
}

interface UseWebSocketChatProps {
  currentSessionRef: RefObject<number | null>;
  serverUrl?: string;
  authToken?: string;
}

export function useWebSocketChat({
  currentSessionRef,
  serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  authToken,
}: UseWebSocketChatProps): UseWebSocketChatReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketChatMessage[]>([]);
  const [sessions, setSessions] = useState<WebSocketChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const joinedSessionsRef = useRef<Set<number>>(new Set());
  const isInitializedRef = useRef<boolean>(false);
  const sessionRef = useRef<WebSocketChatSession | undefined>(undefined);
  const sessionsRef = useRef<WebSocketChatSession[]>([]);

  useEffect(() => {
    const initializeSocket = async () => {
      console.log('Initializing socket');
      try {
        if (!authToken) {
          setError('No authentication token provided');
          return;
        }

        // Prevent duplicate initialization
        if (isInitializedRef.current || socket) {
          console.log('Socket already initialized or exists, skipping...');
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
          setIsConnected(true);
          setError(null);
        });

        socketInstance.on('disconnect', (reason: string) => {
          setIsConnected(false);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            socketInstance.connect();
          }
        });

        socketInstance.on('connect_error', (err: any) => {
          console.error('WebSocket connection error:', err);
          console.error(
            'Auth token being used:',
            authToken ? 'Token present' : 'No token'
          );
          setError(`Connection error: ${err.message || 'Failed to connect'}`);
          setIsConnected(false);
        });

        socketInstance.on('reconnect', (attemptNumber: number) => {
          console.log(
            'Reconnected to WebSocket server, attempt:',
            attemptNumber
          );
          setIsConnected(true);
          setError(null);
        });

        socketInstance.on('reconnect_error', (err: any) => {
          console.error('WebSocket reconnection error:', err);
          setError(`Reconnection failed: ${err.message || 'Unknown error'}`);
        });

        // Handle all sessions response
        socketInstance.on(
          'all_sessions',
          (sessions: WebSocketChatSession[]) => {
            console.log('Received sessions from all_sessions:', sessions);
            sessionsRef.current = sessions;
            sessionRef.current = sessions.find(
              (session) => session.id === currentSessionRef.current
            );
            setSessions(sessions);
            setIsLoadingSessions(false);
          }
        );

        socketInstance.on(
          'messages',
          (sessionMessages: WebSocketChatMessage[]) => {
            console.log('Received messages for session:', sessionMessages);
            if (sessionMessages && sessionMessages.length > 0) {
              const sessionId = sessionMessages[0].chat_session_id;
              if (currentSessionRef.current === sessionId) {
                console.log('Setting messages for current session:', sessionId);
                setMessages(sessionMessages);
              }
            }
            setIsLoading(false);
          }
        );

        socketInstance.on('new_message', (message: WebSocketChatMessage) => {
          // Add message to the current view if it's for the currently selected session
          if (currentSessionRef.current === message.chat_session_id) {
            setMessages((prev) => [...prev, message]);
          } else {
            // Find the session from the current sessions ref
            const session = sessionsRef.current.find(
              (s) => s.id === message.chat_session_id
            );
            if (session) {
              toast.warning(`${session.guest_name} has a new message`, {
                position: 'bottom-right',
                description: message.message,
              });
            }
          }
        });

        socketInstance.on('session_error', (errorData: { message: string }) => {
          console.error('Session error:', errorData.message);
          setError(errorData.message);
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
            console.log('New session received from admin room:', sessionData);

            // Add the new session to the sessions list
            const newSession: WebSocketChatSession = {
              id: sessionData.sessionId,
              customer_id: parseInt(sessionData.customerId),
              guest_name: sessionData.guestName,
              status_session: sessionData.status,
              session_key: `session_${sessionData.sessionId}`, // Generate a session key
              created_at: sessionData.createdAt,
              updated_at: sessionData.createdAt,
              deleted_at: undefined,
            };

            setSessions((prev) => {
              // Check if session already exists to avoid duplicates
              const exists = prev.some(
                (session) => session.id === sessionData.sessionId
              );
              let updatedSessions;
              if (exists) {
                console.log('Session already exists, updating instead');
                updatedSessions = prev.map((session) =>
                  session.id === sessionData.sessionId ? newSession : session
                );
              } else {
                console.log('Adding new session to list');
                updatedSessions = [newSession, ...prev];
              }
              // Update the sessions ref
              sessionsRef.current = updatedSessions;
              return updatedSessions;
            });
          }
        );

        // Handle session ended/closed event
        socketInstance.on(
          'session_ended',
          (data: { sessionId: number; message: string }) => {
            console.log('Session ended from session_ended:', data);

            // Update the session status in the sessions list
            setSessions((prev) => {
              const updatedSessions = prev.map((session) =>
                session.id === data.sessionId
                  ? { ...session, status_session: 'CLOSED' as const }
                  : session
              );
              // Update the sessions ref
              sessionsRef.current = updatedSessions;
              return updatedSessions;
            });

            // If this is the currently selected session, show a message
            if (currentSessionRef.current === data.sessionId) {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  chat_session_id: data.sessionId,
                  sender_type: 'EMP',
                  sender_id: 0,
                  message: data.message || 'This chat session has been ended.',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]);
            }
          }
        );

        setSocket(socketInstance);
        isInitializedRef.current = true;

        // Cleanup on unmount
        return () => {
          console.log('Cleaning up socket connection');
          isInitializedRef.current = false;
          socketInstance.removeAllListeners();
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setError(
          'Failed to load WebSocket client. Please install socket.io-client.'
        );
      }
    };

    initializeSocket();
  }, [serverUrl, authToken]);

  // Fetch sessions via WebSocket event
  const fetchSessions = useCallback(async () => {
    if (!socket || !isConnected) {
      console.log('Cannot fetch sessions: WebSocket not connected');
      return;
    }

    setIsLoadingSessions(true);
    setError(null);

    try {
      console.log('Requesting all sessions via WebSocket...');
      socket.emit('get_all_sessions');
    } catch (error) {
      console.error('Error requesting sessions:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to request sessions'
      );
      setIsLoadingSessions(false);
    }
  }, [socket, isConnected]);

  // Join a chat session
  const joinSession = useCallback(
    (chatSessionId: number) => {
      if (!socket || !isConnected) {
        setError('WebSocket not connected');
        return;
      }

      // Always set loading when switching to a different session
      if (currentSessionRef.current !== chatSessionId) {
        setIsLoading(true);
        setMessages([]); // Clear previous messages
      }

      setError(null);
      currentSessionRef.current = chatSessionId;

      // Add acknowledgment callback to see if the event was received
      socket.emit('get_messages', { chatSessionId }, (response: any) => {
        console.log('get_messages:', response);
      });

      joinedSessionsRef.current.add(chatSessionId);

      // Set a timeout to stop loading if no response
      setTimeout(() => {
        if (currentSessionRef.current === chatSessionId) {
          setIsLoading(false);
        }
      }, 5000);
    },
    [socket, isConnected]
  );

  // Send a message
  const sendMessage = useCallback(
    (chatSessionId: number, message: string) => {
      if (!socket || !isConnected) {
        setError('WebSocket not connected');
        return;
      }

      if (!message.trim()) {
        setError('Message cannot be empty');
        return;
      }

      console.log('Sending message:', { chatSessionId, message });
      socket.emit('reply_message', { chatSessionId, message });
      setError(null);
    },
    [socket, isConnected]
  );

  // Auto-fetch sessions when connected and have auth token
  useEffect(() => {
    if (isConnected && socket && authToken) {
      fetchSessions();
    }
  }, [isConnected, socket, authToken, fetchSessions]);

  return {
    socket,
    isConnected,
    messages,
    sessions,
    joinSession,
    sendMessage,
    fetchSessions,
    error,
    isLoading,
    isLoadingSessions,
  };
}
