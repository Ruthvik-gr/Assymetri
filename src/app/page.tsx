import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    title: 'Real-time Weather',
    description: 'Ask for weather in any city and get live temperature, humidity, and wind data.',
    icon: '🌤️',
  },
  {
    title: 'F1 Race Data',
    description: 'Get Formula 1 race schedules and results for any season or round.',
    icon: '🏎️',
  },
  {
    title: 'Stock Prices',
    description: 'Check live stock quotes, price changes, and market data for any ticker.',
    icon: '📈',
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Chat with an AI that has access to real-time data — weather, F1 races, and stock prices.
          </p>
          <Link href="/login">
            <Button size="lg" className="mt-4">Get Started</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader className="pb-2">
                <div className="text-3xl mb-1">{f.icon}</div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
