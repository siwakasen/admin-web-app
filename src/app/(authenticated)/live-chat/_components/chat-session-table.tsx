'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export interface ChatSession {
  id: string;
  customer_id: string;
  guest_name: string;
  status_session: 'OPEN' | 'CLOSED';
  session_key: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface ChatSessionTableProps {
  sessions: ChatSession[];
  onSessionSelect: (session: ChatSession) => void;
  selectedSessionId?: string;
}

const statusConfig = {
  OPEN: {
    variant: 'default' as const,
    label: 'Active',
    color: 'bg-green-500',
  },
  CLOSED: {
    variant: 'outline' as const,
    label: 'Closed',
    color: 'bg-gray-500',
  },
};

export function ChatSessionTable({
  sessions,
  onSessionSelect,
  selectedSessionId,
}: ChatSessionTableProps) {
  return (
    <div className="rounded-md border h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No active chat sessions
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow
                  key={session.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSessionId === session.id
                      ? 'bg-muted/50 border-l-4 border-l-primary'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => onSessionSelect(session)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{session.guest_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          statusConfig[session.status_session].color
                        }`}
                      />
                      <Badge
                        variant={statusConfig[session.status_session].variant}
                      >
                        {statusConfig[session.status_session].label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionSelect(session);
                      }}
                    >
                      Open Chat
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
