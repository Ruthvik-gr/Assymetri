'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { UIMessage } from 'ai'
import { ConversationSidebar } from './ConversationSidebar'
import { ChatMessage } from './ChatMessage'
import { TypingIndicator } from './TypingIndicator'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PanelLeftClose, PanelLeft, ArrowUp } from 'lucide-react'
import {
  getOrCreateConversation,
  saveMessages,
  updateConversationTitle,
  getConversationMessages,
} from '@/lib/db/actions'

export function ChatInterface() {
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const conversationIdRef = useRef<string | undefined>(undefined)

  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ messages: finalMessages }) => {
      if (conversationIdRef.current) {
        saveMessages(conversationIdRef.current, finalMessages).catch(() => {})
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    let convId = conversationId
    if (!convId) {
      const conv = await getOrCreateConversation()
      if (!conv) return
      convId = conv.id
      setConversationId(convId)
      conversationIdRef.current = convId
    }

    setInput('')
    textareaRef.current?.focus()
    sendMessage({ text })

    if (messages.length === 0) {
      await updateConversationTitle(convId, text)
    }
  }, [input, isLoading, conversationId, messages.length, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSelectConversation = useCallback(async (id: string) => {
    setConversationId(id)
    conversationIdRef.current = id
    const msgs = await getConversationMessages(id)
    setMessages(msgs.map((m) => ({ ...m, parts: m.parts as UIMessage['parts'] })) as UIMessage[])
  }, [setMessages])

  const handleNewChat = useCallback(() => {
    setConversationId(undefined)
    conversationIdRef.current = undefined
    setMessages([])
    setInput('')
  }, [setMessages])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <ConversationSidebar
          activeId={conversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewChat}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <header className="flex items-center justify-between border-b px-3 h-14 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen
              ? <PanelLeftClose className="h-4 w-4" />
              : <PanelLeft className="h-4 w-4" />
            }
          </Button>
          <UserAvatar />
        </header>

        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-6">
              <div className="text-center space-y-4 max-w-sm w-full">
                <h2 className="text-2xl font-semibold tracking-tight">How can I help you?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask me anything — I can fetch live weather, F1 race data, and stock prices.
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-1">
                  {['Weather in Tokyo', 'F1 2024 schedule', 'AAPL stock price'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full py-6 px-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t bg-background px-4 py-3 shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-end rounded-2xl border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Assistant..."
                className="flex-1 min-h-[52px] max-h-[180px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 py-3.5 pr-14 text-sm leading-relaxed"
                disabled={isLoading}
                rows={1}
              />
              <div className="absolute right-2 bottom-2">
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  disabled={!input.trim() || isLoading}
                  onClick={handleSubmit}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI can make mistakes — verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
