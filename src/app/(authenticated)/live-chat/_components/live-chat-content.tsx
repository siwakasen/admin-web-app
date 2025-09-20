'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatSessionTable, ChatSession } from './chat-session-table';
import { ChatRoom, ChatMessage } from './chat-room';
import {
  useWebSocketChat,
  WebSocketChatMessage,
  WebSocketChatSession,
} from '@/hooks/use-websocket-chat';
import { getToken } from '@/lib/user-provider';

// Adapter functions to convert WebSocket data to component interfaces
function adaptWebSocketSession(wsSession: WebSocketChatSession): ChatSession {
  return {
    id: wsSession.id.toString(),
    customer_id: wsSession.customer_id?.toString() || '',
    guest_name: wsSession.guest_name || '',
    status_session: wsSession.status_session,
    session_key: wsSession.session_key || '',
    created_at: wsSession.created_at,
    updated_at: wsSession.updated_at,
    deleted_at: wsSession.deleted_at || '',
  };
}

function adaptWebSocketMessage(wsMessage: WebSocketChatMessage): ChatMessage {
  return {
    id: wsMessage.id.toString(),
    senderId: wsMessage.sender_id?.toString() || '',
    senderName: wsMessage.sender_type === 'EMP' ? 'Admin' : 'Customer',
    senderType: wsMessage.sender_type === 'EMP' ? 'admin' : 'customer',
    message: wsMessage.message,
    timestamp: wsMessage.created_at,
    status: 'read', // You might want to track this in your backend
  };
}

export default function LiveChatWrapper() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const currentSessionRef = useRef<number | null>(null);

  // Get auth token on component mount using server action
  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token || null);
      } catch (error) {
        console.error('Failed to get auth token:', error);
        setAuthToken(null);
      }
    };

    fetchAuthToken();
  }, []);

  const {
    isConnected,
    messages: wsMessages,
    sessions: wsSessions,
    joinSession,
    sendMessage,
    error: wsError,
    isLoading,
    isLoadingSessions,
  } = useWebSocketChat({
    currentSessionRef,
    serverUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    authToken: authToken || undefined,
  });

  // Local state
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  // Adapt WebSocket data to component interfaces
  const sessions = wsSessions.map(adaptWebSocketSession);
  const messages = wsMessages.map(adaptWebSocketMessage);

  // Handle responsive design
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session);

    // Join the session via WebSocket (if not already joined)
    joinSession(parseInt(session.id));
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedSession || !isConnected) {
      console.error(
        'Cannot send message: no session selected or not connected'
      );
      return;
    }

    // Send message via WebSocket
    sendMessage(parseInt(selectedSession.id), messageText);
  };

  const handleBackToSessions = () => {
    // Don't leave the session, just go back to session list
    setSelectedSession(null);
    currentSessionRef.current = null;
  };

  // Don't render until we have an auth token
  if (!authToken) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Mobile view: show either sessions list or chat room
  if (isMobile) {
    const selectedId = selectedSession?.id;
    return (
      <div className="h-full flex flex-col">
        {/* Connection Status */}
        {(!isConnected || isLoadingSessions) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex-shrink-0">
            <p className="text-sm text-yellow-800">
              {wsError
                ? `Connection Error: ${wsError}`
                : !isConnected
                ? 'Connecting to chat server...'
                : 'Loading chat sessions...'}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {selectedSession ? (
            <ChatRoom
              session={selectedSession}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBackToSessions={handleBackToSessions}
              isConnected={isConnected}
              isLoading={isLoading}
            />
          ) : (
            <ChatSessionTable
              sessions={sessions}
              onSessionSelect={handleSessionSelect}
              selectedSessionId={selectedId}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop view: show session list, and chat room only when session is selected
  const selectedId = selectedSession?.id;
  return (
    <div className="h-full flex flex-col">
      {/* Connection Status */}
      {(!isConnected || isLoadingSessions) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex-shrink-0">
          <p className="text-sm text-yellow-800">
            {wsError
              ? `Connection Error: ${wsError}`
              : !isConnected
              ? 'Connecting to chat server...'
              : 'Loading chat sessions...'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-hidden p-4">
        {selectedSession ? (
          // Show only chat room when session is selected
          <ChatRoom
            session={selectedSession}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBackToSessions={handleBackToSessions}
            isConnected={isConnected}
            isLoading={isLoading}
          />
        ) : (
          // Show only session table when no session is selected
          <ChatSessionTable
            sessions={sessions}
            onSessionSelect={handleSessionSelect}
            selectedSessionId={selectedId}
          />
        )}
      </div>
    </div>
  );
}
