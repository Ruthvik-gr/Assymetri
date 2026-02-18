'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserConversations, deleteConversation } from '@/lib/db/actions'
import { cn } from '@/lib/utils'
import { SquarePen, Trash2, MessageSquare, Sparkles } from 'lucide-react'

type Conversation = {
  id: string
  title: string
  updatedAt: Date
}

interface ConversationSidebarProps {
  activeId?: string
  onSelect: (id: string) => void
  onNew: () => void
}

export function ConversationSidebar({ activeId, onSelect, onNew }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isPending, startTransition] = useTransition()

  const load = () => {
    startTransition(async () => {
      const data = await getUserConversations()
      setConversations(data as Conversation[])
    })
  }

  useEffect(() => { load() }, [activeId])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await deleteConversation(id)
    load()
    if (id === activeId) onNew()
  }

  return (
    <div className="flex flex-col h-full w-60 border-r shrink-0">
      <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Chats</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onNew}
          title="New chat"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {isPending && conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-3 leading-relaxed">
              No conversations yet. Start a new chat!
            </p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer hover:bg-muted transition-colors',
                  activeId === c.id && 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{c.title}</span>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 shrink-0 ml-1 p-0.5 rounded hover:text-destructive transition-all"
                  onClick={(e) => handleDelete(e, c.id)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
