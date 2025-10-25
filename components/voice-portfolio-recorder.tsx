"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface VoicePortfolioRecorderProps {
  userId: string
}

export default function VoicePortfolioRecorder({ userId }: VoicePortfolioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const router = useRouter()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError("Failed to access microphone. Please check your permissions.")
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processRecording = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert audio to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result as string

        // Call API to process the audio
        const response = await fetch("/api/portfolio/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioData: base64Audio,
            userId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate portfolio")
        }

        const data = await response.json()
        router.push(`/portfolio/${data.portfolioId}`)
      }
    } catch (err) {
      setError("Failed to process recording. Please try again.")
      console.error(err)
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Your Story</CardTitle>
        <CardDescription>
          Talk about your projects, skills, and what you're looking for. Aim for 2-5 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Visualizer */}
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg relative overflow-hidden">
          {isRecording ? (
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Mic className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">{audioBlob ? "Recording complete" : "Ready to record"}</p>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !audioBlob && (
            <Button size="lg" onClick={startRecording} className="gap-2">
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button size="lg" variant="destructive" onClick={stopRecording} className="gap-2">
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          )}

          {!isRecording && audioBlob && !isProcessing && (
            <>
              <Button size="lg" variant="outline" onClick={() => setAudioBlob(null)}>
                Re-record
              </Button>
              <Button size="lg" onClick={processRecording} className="gap-2">
                <Sparkles className="h-5 w-5" />
                Generate Portfolio
              </Button>
            </>
          )}

          {isProcessing && (
            <Button size="lg" disabled className="gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </Button>
          )}
        </div>

        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center">{error}</div>}

        {/* Tips */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Tips for a great portfolio:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Describe 2-3 projects you've worked on</li>
            <li>Mention the technologies and tools you used</li>
            <li>Explain your role and contributions</li>
            <li>Share what you learned and achieved</li>
            <li>Talk about what kind of work you're looking for</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
