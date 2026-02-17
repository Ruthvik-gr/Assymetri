'use client'

import { UIMessage } from 'ai'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full gap-3 px-4 py-6',
        isUser ? 'bg-background' : 'bg-muted/50'
      )}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
        </div>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {message.content}
        </div>
      </div>
    </div>
  )
}
