import { tool, zodSchema } from 'ai'
import { z } from 'zod'

const schema = z.object({
  city: z.string().describe('The name of the city to get weather for'),
})

export const weatherTool = tool({
  description: 'Get the current weather for a city',
  inputSchema: zodSchema(schema),
  execute: async ({ city }: z.infer<typeof schema>) => {
    const base = process.env.OPENWEATHER_BASE_URL
    const key = process.env.OPENWEATHER_API_KEY
    const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`

    const res = await fetch(url)

    if (!res.ok) {
      return { error: `Could not find weather for "${city}"` }
    }

    const data = await res.json()

    return {
      city: data.name as string,
      country: data.sys.country as string,
      temperature: Math.round(data.main.temp) as number,
      feelsLike: Math.round(data.main.feels_like) as number,
      humidity: data.main.humidity as number,
      description: data.weather[0].description as string,
      windSpeed: data.wind.speed as number,
    }
  },
})
