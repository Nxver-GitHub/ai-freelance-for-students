"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Play, Pause, Trash2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const recordedBlobRef = useRef<Blob | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Setup audio context for waveform visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      source.connect(analyserRef.current)

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        recordedBlobRef.current = audioBlob
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      // Start waveform visualization
      drawWaveform()
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || isPaused) return

      animationRef.current = requestAnimationFrame(draw)

      analyserRef.current!.getByteTimeDomainData(dataArray)

      canvasCtx.fillStyle = "rgb(13, 17, 23)"
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = "rgb(249, 115, 22)" // YC orange
      canvasCtx.beginPath()

      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }

    draw()
  }

  const deleteRecording = () => {
    setAudioURL(null)
    setDuration(0)
    recordedBlobRef.current = null
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    if (!audioElementRef.current) return

    if (isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
    } else {
      audioElementRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSubmit = () => {
    if (recordedBlobRef.current) {
      onRecordingComplete(recordedBlobRef.current, duration)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle>Voice Recording Studio</CardTitle>
        <CardDescription>Record your introduction and talk about your projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Waveform Visualizer */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className={cn(
              "w-full h-48 rounded-lg border-2 transition-colors",
              isRecording && !isPaused ? "border-primary" : "border-border",
            )}
          />
          {!isRecording && !audioURL && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Waveform will appear here</p>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-primary">{formatTime(duration)}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {isRecording ? (isPaused ? "Paused" : "Recording...") : "Ready to record"}
          </p>
        </div>

        {/* Recording Controls */}
        {!audioURL && (
          <div className="flex items-center justify-center gap-3">
            {!isRecording ? (
              <Button size="lg" onClick={startRecording} className="gap-2">
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" onClick={pauseRecording}>
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
                <Button size="lg" variant="destructive" onClick={stopRecording} className="gap-2">
                  <Square className="w-5 h-5" />
                  Stop
                </Button>
              </>
            )}
          </div>
        )}

        {/* Playback Controls */}
        {audioURL && (
          <div className="space-y-4">
            <audio
              ref={audioElementRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
              controls
            />

            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={togglePlayback} className="gap-2 bg-transparent">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button variant="outline" onClick={deleteRecording} className="gap-2 bg-transparent">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Upload className="w-4 h-4" />
                Submit Recording
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
