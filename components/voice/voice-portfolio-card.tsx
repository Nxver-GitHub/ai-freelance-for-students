import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Clock } from "lucide-react"

interface VoicePortfolioCardProps {
  voicePortfolio: any
}

export function VoicePortfolioCard({ voicePortfolio }: VoicePortfolioCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Voice Recording</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                {voicePortfolio.duration_seconds ? formatDuration(voicePortfolio.duration_seconds) : "Unknown"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary">{new Date(voicePortfolio.created_at).toLocaleDateString()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {voicePortfolio.audio_url && (
          <audio controls className="w-full">
            <source src={voicePortfolio.audio_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {voicePortfolio.transcript && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-3">{voicePortfolio.transcript}</p>
        )}
      </CardContent>
    </Card>
  )
}
