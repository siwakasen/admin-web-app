'use client';

import { useGlobalChat } from '@/hooks/use-global-chat';
/**
 * Global Live Chat Wrapper Component
 * This component handles WebSocket connection and shows toast notifications
 */
export default function LiveChatWrapper() {
  const { isConnected, error } = useGlobalChat({
    serverUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  });

  // This component doesn't render anything visible
  // It only handles the WebSocket connection and toast notifications
  return null;
}
