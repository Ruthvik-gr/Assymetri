import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Cloud, Trophy, TrendingUp } from 'lucide-react'

const features = [
  {
    title: 'Real-time Weather',
    description: 'Ask for weather in any city — live temperature, humidity, and wind data.',
    icon: Cloud,
  },
  {
    title: 'F1 Race Data',
    description: 'Get Formula 1 race schedules and results for any season or round.',
    icon: Trophy,
  },
  {
    title: 'Stock Prices',
    description: 'Check live stock quotes, price changes, and market data for any ticker.',
    icon: TrendingUp,
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl w-full space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Powered by LLaMA 3.1 via Groq
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Your AI Assistant
          </h1>

          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Chat with an AI that has access to real-time data — weather, F1 races, and live stock prices.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-xl border bg-card p-6 text-left space-y-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
