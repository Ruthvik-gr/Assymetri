'use client'

import { UIMessage, isToolUIPart, getToolName } from 'ai'
import { cn } from '@/lib/utils'
import { WeatherCard } from '@/components/tools/WeatherCard'
import { F1Card } from '@/components/tools/F1Card'
import { StockCard } from '@/components/tools/StockCard'

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
    <div
      className={cn(
        'flex w-full gap-3 px-4 py-6',
        isUser ? 'bg-background' : 'bg-muted/50'
      )}
    >
      <div className="flex-1 space-y-3">
        <span className="text-sm font-semibold">
          {isUser ? 'You' : 'AI Assistant'}
        </span>

        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            return (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
                {part.text}
              </p>
            )
          }
          if (isToolUIPart(part) && part.state === 'output-available') {
            return (
              <div key={i} className="max-w-sm">
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
