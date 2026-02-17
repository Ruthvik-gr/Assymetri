'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RaceResult {
  position: string
  driver: string
  team: string
  time: string
}

interface ScheduleRace {
  round: string
  raceName: string
  circuit: string
  country: string
  date: string
}

interface F1Data {
  raceName?: string
  circuit?: string
  date?: string
  results?: RaceResult[]
  season?: string
  totalRaces?: number
  schedule?: ScheduleRace[]
  error?: string
}

export function F1Card({ data }: { data: F1Data }) {
  if (data.error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-4 text-destructive text-sm">{data.error}</CardContent>
      </Card>
    )
  }

  if (data.results) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{data.raceName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.circuit} · {data.date}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {data.results.map((r) => (
              <div key={r.position} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                <span className="w-6 font-bold text-muted-foreground">P{r.position}</span>
                <span className="flex-1 font-medium">{r.driver}</span>
                <span className="text-muted-foreground text-xs">{r.team}</span>
                <span className="ml-4 font-mono text-xs">{r.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">F1 {data.season} Season Schedule</CardTitle>
        <p className="text-sm text-muted-foreground">{data.totalRaces} races</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {data.schedule?.map((r) => (
            <div key={r.round} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
              <span className="w-6 text-muted-foreground">R{r.round}</span>
              <span className="flex-1 font-medium">{r.raceName}</span>
              <span className="text-muted-foreground text-xs">{r.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
