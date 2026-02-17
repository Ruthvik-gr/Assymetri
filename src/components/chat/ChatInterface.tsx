'use client'

import { useState, ChangeEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatList } from './ChatList'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState('')
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatList messages={messages} />
      {isLoading && <TypingIndicator />}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
