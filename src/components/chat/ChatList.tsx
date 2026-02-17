'use client'

import { UIMessage } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'

interface ChatListProps {
  messages: UIMessage[]
}

export function ChatList({ messages }: ChatListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation by sending a message
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  )
}
