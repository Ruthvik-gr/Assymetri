import { streamText, stepCountIs } from 'ai'
import { groq } from '@/lib/ai/config'
import { weatherTool } from '@/lib/tools/weather'
import { f1Tool } from '@/lib/tools/f1'
import { stockTool } from '@/lib/tools/stocks'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: groq('llama-3.1-8b-instant'),
    messages,
    system: 'You are a helpful AI assistant with access to real-time data tools. When users ask about weather, use the weatherTool. For Formula 1 races or schedules, use the f1Tool. For stock prices, use the stockTool. Always use the tools when relevant and present the data clearly.',
    tools: {
      weatherTool,
      f1Tool,
      stockTool,
    },
    stopWhen: stepCountIs(5),
  })

  return result.toTextStreamResponse()
}
