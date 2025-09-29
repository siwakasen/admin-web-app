'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  ArrowLeft,
  User,
  CheckCheck,
  Check,
  MoreVertical,
} from 'lucide-react';
import { ChatSession } from './chat-session-table';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'admin';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatRoomProps {
  session: ChatSession | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onBackToSessions: () => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

export function ChatRoom({
  session,
  messages,
  onSendMessage,
  onBackToSessions,
  isConnected = true,
  isLoading = false,
}: ChatRoomProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (timestamp: string) => {
    // Parse the timestamp (assuming it's in GMT+8)
    const date = new Date(timestamp);

    // If the timestamp is in GMT+8, we need to subtract 8 hours to get UTC
    // then let JavaScript handle the conversion to user's local timezone
    const gmtPlus8Offset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    const utcTime = new Date(date.getTime() - gmtPlus8Offset);

    // Now convert to user's local timezone
    return utcTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMessageStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a chat session to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden gap-0">
      {/* Chat Header - Sticky */}
      <CardHeader className="sticky top-0 z-10 border-b [.border-b]:pb-0 flex-shrink-0 px-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBackToSessions}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{session.guest_name}</CardTitle>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                session.status_session === 'OPEN' ? 'default' : 'secondary'
              }
            >
              {session.status_session === 'OPEN' ? 'Online' : 'Closed'}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4 pb-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isAdmin = message.senderType === 'admin';
                const showDateSeparator =
                  index === 0 ||
                  formatDate(messages[index - 1].timestamp) !==
                    formatDate(message.timestamp);

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        isAdmin ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isAdmin ? 'order-2' : 'order-1'
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isAdmin
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.message}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                            isAdmin ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {isAdmin && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input - Sticky Bottom */}
        <div className="sticky bottom-0 z-10 border-t p-4 flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !isConnected
                  ? 'Connecting...'
                  : `Message ${session.guest_name}...`
              }
              className="flex-1"
              disabled={session.status_session === 'CLOSED' || !isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !newMessage.trim() ||
                session.status_session === 'CLOSED' ||
                !isConnected
              }
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {session.status_session === 'CLOSED' && (
            <p className="text-xs text-muted-foreground mt-2">
              This chat session has been closed
            </p>
          )}
          {!isConnected && session.status_session !== 'CLOSED' && (
            <p className="text-xs text-muted-foreground mt-2">
              Connecting to chat server...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
