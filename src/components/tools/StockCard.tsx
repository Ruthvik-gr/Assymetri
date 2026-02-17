'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StockData {
  symbol: string
  company: string
  currentPrice: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  error?: string
}

export function StockCard({ data }: { data: StockData }) {
  if (data.error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-4 text-destructive text-sm">{data.error}</CardContent>
      </Card>
    )
  }

  const isPositive = data.change >= 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{data.symbol}</span>
          <span className={cn('text-lg font-bold', isPositive ? 'text-green-600' : 'text-red-600')}>
            ${data.currentPrice.toFixed(2)}
          </span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data.company}</p>
          <span className={cn('text-sm font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
            {isPositive ? '+' : ''}{data.change} ({isPositive ? '+' : ''}{data.changePercent}%)
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Open</span>
          <p className="font-medium">${data.open.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Prev Close</span>
          <p className="font-medium">${data.previousClose.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">High</span>
          <p className="font-medium text-green-600">${data.high.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Low</span>
          <p className="font-medium text-red-600">${data.low.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
