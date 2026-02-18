'use client'

import { UIMessage, isToolUIPart, getToolName } from 'ai'
import { cn } from '@/lib/utils'
import { WeatherCard } from '@/components/tools/WeatherCard'
import { F1Card } from '@/components/tools/F1Card'
import { StockCard } from '@/components/tools/StockCard'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: UIMessage
}

function ToolResult({ toolName, result }: { toolName: string; result: unknown }) {
  if (toolName === 'weatherTool') return <WeatherCard data={result as any} />
  if (toolName === 'f1Tool') return <F1Card data={result as any} />
  if (toolName === 'stockTool') return <StockCard data={result as any} />
  return null
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3 py-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted border'
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('flex flex-col gap-2 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        {message.parts.map((part, i) => {
          if (part.type === 'text' && part.text) {
            return (
              <div
                key={i}
                className={cn(
                  'rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                )}
              >
                {part.text}
              </div>
            )
          }
          if (isToolUIPart(part) && part.state === 'output-available') {
            return (
              <div key={i} className="w-full max-w-sm">
                <ToolResult toolName={getToolName(part)} result={part.output} />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
