import { tool, zodSchema } from 'ai'
import { z } from 'zod'

const schema = z.object({
  season: z.string().describe('The F1 season year. Use "current" for the current season, or a specific year like "2025". Default to "current" when the user asks about upcoming or next races.'),
  round: z.string().optional().describe('The round number (optional). If omitted returns the full schedule'),
})

export const f1Tool = tool({
  description: 'Get Formula 1 race schedule or results for a given season and optionally a round. For current/upcoming/next race queries always use season="current".',
  inputSchema: zodSchema(schema),
  execute: async ({ season, round }: z.infer<typeof schema>) => {
    const base = process.env.ERGAST_BASE_URL

    const resolvedSeason = season === 'current' ? String(new Date().getFullYear()) : season

    const path = round && round !== 'All' ? `/${resolvedSeason}/${round}/results.json` : `/${resolvedSeason}.json`
    const url = `${base}${path}`

    let res: Response
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    } catch {
      return { error: 'F1 API is currently unavailable. Please try again later.' }
    }

    if (!res.ok) {
      return { error: `Could not fetch F1 data for season "${resolvedSeason}"` }
    }

    const data = await res.json()
    const table = data.MRData

    if (round && round !== 'All') {
      const race = table.RaceTable.Races[0]
      if (!race) return { error: `No results found for round ${round} of ${resolvedSeason}` }

      return {
        raceName: race.raceName as string,
        circuit: race.Circuit.circuitName as string,
        date: race.date as string,
        results: race.Results.slice(0, 10).map((r: any) => ({
          position: r.position as string,
          driver: `${r.Driver.givenName} ${r.Driver.familyName}`,
          team: r.Constructor.name as string,
          time: (r.Time?.time ?? r.status) as string,
        })),
      }
    }

    const races = table.RaceTable.Races
    const today = new Date().toISOString().split('T')[0]

    return {
      season: resolvedSeason,
      today,
      totalRaces: races.length as number,
      schedule: races.map((r: any) => ({
        round: r.round as string,
        raceName: r.raceName as string,
        circuit: r.Circuit.circuitName as string,
        country: r.Circuit.Location.country as string,
        date: r.date as string,
        upcoming: r.date >= today,
      })),
    }
  },
})
