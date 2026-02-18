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
import { Send, Sparkles, Menu, X } from 'lucide-react'
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

  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: () => {
      if (conversationId) {
        saveMessages(conversationId, messages)
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
    const msgs = await getConversationMessages(id)
    setMessages(msgs.map((m) => ({ ...m, parts: m.parts as UIMessage['parts'] })) as UIMessage[])
  }, [setMessages])

  const handleNewChat = useCallback(() => {
    setConversationId(undefined)
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
        <header className="flex items-center justify-between border-b px-4 h-14 shrink-0 bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
          </div>
          <UserAvatar />
        </header>

        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-3 px-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">How can I help you?</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Ask me anything — I can fetch live weather, F1 race data, and stock prices.
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {['Weather in Tokyo', 'F1 2024 schedule', 'AAPL stock price'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full py-6 px-4 space-y-1">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t bg-background px-4 py-3 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-xl border border-input bg-muted/30 px-3 py-2 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                className="flex-1 min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm leading-relaxed"
                disabled={isLoading}
                rows={1}
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg mb-0.5"
                disabled={!input.trim() || isLoading}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
              </Button>
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
