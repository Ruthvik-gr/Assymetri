import { tool, zodSchema } from 'ai'
import { z } from 'zod'

const schema = z.object({
  season: z.string().describe('The F1 season year (e.g. "2024" or "current")'),
  round: z.string().optional().describe('The round number (optional). If omitted returns the full schedule'),
})

export const f1Tool = tool({
  description: 'Get Formula 1 race schedule or results for a given season and optionally a round',
  inputSchema: zodSchema(schema),
  execute: async ({ season, round }: z.infer<typeof schema>) => {
    const base = process.env.ERGAST_BASE_URL
    const path = round ? `/${season}/${round}/results.json` : `/${season}.json`
    const url = `${base}${path}`

    const res = await fetch(url)

    if (!res.ok) {
      return { error: `Could not fetch F1 data for season "${season}"` }
    }

    const data = await res.json()
    const table = data.MRData

    if (round) {
      const race = table.RaceTable.Races[0]
      if (!race) return { error: `No results found for round ${round} of ${season}` }

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
    return {
      season,
      totalRaces: races.length as number,
      schedule: races.map((r: any) => ({
        round: r.round as string,
        raceName: r.raceName as string,
        circuit: r.Circuit.circuitName as string,
        country: r.Circuit.Location.country as string,
        date: r.date as string,
      })),
    }
  },
})
