import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Assistant with Tool Calling
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Chat with an AI assistant that can fetch real-time weather data, F1 race information, and stock prices.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
