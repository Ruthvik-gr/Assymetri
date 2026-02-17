'use client'

import { useState, ChangeEvent, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatList } from './ChatList'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { ConversationSidebar } from './ConversationSidebar'
import { UserAvatar } from '@/components/auth/UserAvatar'
import {
  getOrCreateConversation,
  saveMessages,
  updateConversationTitle,
  getConversationMessages,
} from '@/lib/db/actions'
import { UIMessage } from 'ai'

export function ChatInterface() {
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [input, setInput] = useState('')

  const { messages, setMessages, sendMessage, status } = useChat({
    api: '/api/chat',
    onFinish: () => {
      if (conversationId) {
        saveMessages(conversationId, messages)
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    let convId = conversationId

    if (!convId) {
      const conv = await getOrCreateConversation()
      if (!conv) return
      convId = conv.id
      setConversationId(convId)
    }

    const text = input
    setInput('')
    sendMessage({ text })

    if (messages.length === 0) {
      await updateConversationTitle(convId, text)
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
    <div className="flex h-screen">
      <ConversationSidebar
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between border-b px-4 h-14 shrink-0">
          <h1 className="text-sm font-semibold">AI Assistant</h1>
          <UserAvatar />
        </header>
        <ChatList messages={messages} />
        {isLoading && <TypingIndicator />}
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
