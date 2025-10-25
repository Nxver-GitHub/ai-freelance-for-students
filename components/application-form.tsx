"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface ApplicationFormProps {
  projectId: string
  userId: string
}

export default function ApplicationForm({ projectId, userId }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("")
  const [proposedRate, setProposedRate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("applications").insert({
        project_id: projectId,
        student_id: userId,
        cover_letter: coverLetter || null,
        proposed_rate: proposedRate ? Number.parseFloat(proposedRate) : null,
        status: "pending",
      })

      if (insertError) throw insertError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to this Project</CardTitle>
        <CardDescription>Tell the startup why you're a great fit for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              placeholder="Explain your relevant experience, why you're interested, and what you can bring to this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedRate">Your Hourly Rate ($)</Label>
            <Input
              id="proposedRate"
              type="number"
              placeholder="50"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
            />
          </div>

          {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
