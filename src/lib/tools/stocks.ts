import { tool, zodSchema } from 'ai'
import { z } from 'zod'

const schema = z.object({
  symbol: z.string().describe('The stock ticker symbol (e.g. "AAPL", "TSLA", "GOOGL")'),
})

export const stockTool = tool({
  description: 'Get the current stock price and basic quote data for a ticker symbol',
  inputSchema: zodSchema(schema),
  execute: async ({ symbol }: z.infer<typeof schema>) => {
    const base = process.env.FINNHUB_BASE_URL
    const key = process.env.FINNHUB_API_KEY
    const upper = symbol.toUpperCase()

    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${base}/quote?symbol=${upper}&token=${key}`),
      fetch(`${base}/stock/profile2?symbol=${upper}&token=${key}`),
    ])

    if (!quoteRes.ok) {
      return { error: `Could not fetch stock data for "${upper}"` }
    }

    const quote = await quoteRes.json()
    const profile = profileRes.ok ? await profileRes.json() : {}

    if (quote.c === 0) {
      return { error: `No data found for ticker "${upper}". Please check the symbol.` }
    }

    return {
      symbol: upper,
      company: (profile.name ?? upper) as string,
      currentPrice: quote.c as number,
      change: Number((quote.d ?? 0).toFixed(2)),
      changePercent: Number((quote.dp ?? 0).toFixed(2)),
      high: quote.h as number,
      low: quote.l as number,
      open: quote.o as number,
      previousClose: quote.pc as number,
    }
  },
})
