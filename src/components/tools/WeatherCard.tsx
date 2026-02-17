'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  windSpeed: number
  error?: string
}

export function WeatherCard({ data }: { data: WeatherData }) {
  if (data.error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-4 text-destructive text-sm">{data.error}</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {data.city}, {data.country}
        </CardTitle>
        <p className="text-sm text-muted-foreground capitalize">{data.description}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Temperature</span>
          <p className="font-medium">{data.temperature}°C</p>
        </div>
        <div>
          <span className="text-muted-foreground">Feels Like</span>
          <p className="font-medium">{data.feelsLike}°C</p>
        </div>
        <div>
          <span className="text-muted-foreground">Humidity</span>
          <p className="font-medium">{data.humidity}%</p>
        </div>
        <div>
          <span className="text-muted-foreground">Wind Speed</span>
          <p className="font-medium">{data.windSpeed} m/s</p>
        </div>
      </CardContent>
    </Card>
  )
}
