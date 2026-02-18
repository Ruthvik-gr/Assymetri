'use server'

import { auth } from '@/lib/auth/config'

import { db } from '@/lib/db'
import { conversations, messages } from '@/lib/db/schema'


import { eq, desc } from 'drizzle-orm'
import { UIMessage } from 'ai'
import { nanoid } from 'nanoid'

export async function getOrCreateConversation(conversationId?: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  if (conversationId) {
    const existing = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1)

    if (existing[0]?.userId === session.user.id) return existing[0]
  }

  const id = nanoid()
  const [created] = await db
    .insert(conversations)
    .values({ id, userId: session.user.id, title: 'New Chat' })
    .returning()

  return created
}

export async function saveMessages(conversationId: string, msgs: UIMessage[]) {
  const session = await auth()
  if (!session?.user?.id) return

  await db.delete(messages).where(eq(messages.conversationId, conversationId))

  if (msgs.length === 0) return

  await db.insert(messages).values(
    msgs.map((m) => ({
      id: m.id,
      conversationId,
      role: m.role,
      parts: m.parts,
    }))
  )
}

export async function updateConversationTitle(conversationId: string, firstUserMessage: string) {
  const title = firstUserMessage.slice(0, 60).trim()
  await db
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId))
}

export async function getUserConversations() {
  const session = await auth()
  if (!session?.user?.id) return []

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, session.user.id))
    .orderBy(desc(conversations.updatedAt))
    .limit(30)
}

export async function getConversationMessages(conversationId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  const conv = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1)

  if (conv[0]?.userId !== session.user.id) return []

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)
}

export async function deleteConversation(conversationId: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await db
    .delete(conversations)
    .where(eq(conversations.id, conversationId))
}
