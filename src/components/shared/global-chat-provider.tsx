'use client';

import LiveChatWrapper from '@/app/(authenticated)/live-chat/_components/live-chat-wrapper';
import { usePathname } from 'next/navigation';

/**
 * Global Chat Provider Component
 * This is a client component wrapper that can be used in server components
 */
export default function GlobalChatProvider({
  employeeId,
}: {
  employeeId: number;
}) {
  const pathname = usePathname();
  console.log(pathname);

  if (pathname.startsWith('/live-chat')) {
    return null;
  }

  if (employeeId !== 2) {
    return null;
  }
  return <LiveChatWrapper />;
}
