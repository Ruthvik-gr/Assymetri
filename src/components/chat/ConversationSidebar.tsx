'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getUserConversations, deleteConversation } from '@/lib/db/actions'
import { cn } from '@/lib/utils'
import { MessageSquare, Trash2, Plus } from 'lucide-react'

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
  const router = useRouter()

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
    <div className="flex flex-col h-full w-64 border-r bg-muted/30">
      <div className="p-4">
        <Button onClick={onNew} className="w-full" variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-2">
        {conversations.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
        ) : (
          <div className="space-y-1">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  'flex items-center justify-between group rounded-md px-2 py-2 cursor-pointer hover:bg-muted transition-colors',
                  activeId === c.id && 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{c.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                  onClick={(e) => handleDelete(e, c.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
