"use client"

import { useState } from "react"
import { VoiceRecorder } from "./voice-recorder"
import { VoicePortfolioPreview } from "./voice-portfolio-preview"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface VoiceRecorderContainerProps {
  userId: string
}

export function VoiceRecorderContainer({ userId }: VoiceRecorderContainerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const router = useRouter()

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsProcessing(true)

    try {
      const supabase = createClient()

      // Upload audio to Supabase Storage
      const fileName = `${userId}-${Date.now()}.webm`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("voice-portfolios")
        .upload(fileName, audioBlob)

      if (uploadError) {
        console.error("[v0] Upload error:", uploadError)
        alert("Failed to upload audio. Please try again.")
        setIsProcessing(false)
        return
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("voice-portfolios").getPublicUrl(fileName)

      // TODO: Call AI transcription API here
      // For now, we'll create a placeholder transcript
      const mockTranscript = "This is a placeholder transcript. AI transcription will be implemented in the next phase."
      const mockAIAnalysis = {
        summary: "Passionate developer with experience in web technologies",
        skills: ["React", "TypeScript", "Next.js"],
        projects: [
          {
            title: "E-commerce Platform",
            description: "Built a full-stack e-commerce solution",
            impact: "Increased sales by 40%",
          },
        ],
      }

      // Save to database
      const { data: voiceData, error: dbError } = await supabase
        .from("voice_portfolios")
        .insert({
          student_id: userId,
          audio_url: publicUrl,
          transcript: mockTranscript,
          duration_seconds: duration,
          ai_analysis: mockAIAnalysis,
        })
        .select()
        .single()

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        alert("Failed to save recording. Please try again.")
        setIsProcessing(false)
        return
      }

      // Show preview with AI-generated data
      setPortfolioData({
        ...voiceData,
        ai_analysis: mockAIAnalysis,
      })
    } catch (error) {
      console.error("[v0] Error processing recording:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApprove = async () => {
    // Mark portfolio as approved and redirect to dashboard
    router.push("/dashboard/student")
  }

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Processing your recording...</h3>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </div>
      </div>
    )
  }

  if (portfolioData) {
    return (
      <VoicePortfolioPreview
        portfolioData={portfolioData}
        onApprove={handleApprove}
        onEdit={() => setPortfolioData(null)}
      />
    )
  }

  return <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
}
