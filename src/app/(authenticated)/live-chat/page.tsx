import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MessageCircle } from 'lucide-react';
import LiveChatWrapper from './_components/live-chat-content';

export default function LiveChatPage() {
  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Live Chat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="gap-1 h-[calc(100vh-12rem)] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex gap-1 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  Live Chat
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage and respond to customer chat sessions in real-time
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <LiveChatWrapper />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
