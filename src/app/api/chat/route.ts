import { streamText } from 'ai'
import { groq } from '@/lib/ai/config'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: groq('llama-3.1-8b-instant'),
    messages,
    system: 'You are a helpful AI assistant with access to real-time data. You can help users with weather information, Formula 1 race schedules, and stock prices.',
  })

  return result.toTextStreamResponse()
}
