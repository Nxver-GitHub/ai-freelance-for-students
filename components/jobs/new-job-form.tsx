"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function NewJobForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requiredSkills, setRequiredSkills] = useState("")
  const [jobType, setJobType] = useState("internship")
  const [location, setLocation] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [compensationRange, setCompensationRange] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: jobError } = await supabase.from("job_postings").insert({
        startup_id: userId,
        title,
        description,
        required_skills: requiredSkills.split(",").map((s) => s.trim()),
        job_type: jobType,
        location: location || null,
        is_remote: isRemote,
        compensation_range: compensationRange || null,
        is_active: true,
      })

      if (jobError) throw jobError

      router.push("/dashboard/startup")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Post a New Job</CardTitle>
        <CardDescription>Find talented student builders for your startup</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Full Stack Engineer"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Input
                id="requiredSkills"
                type="text"
                placeholder="React, TypeScript, Node.js (comma separated)"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isRemote" checked={isRemote} onCheckedChange={(checked) => setIsRemote(checked === true)} />
              <Label htmlFor="isRemote" className="text-sm font-normal cursor-pointer">
                Remote work available
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="compensationRange">Compensation Range (optional)</Label>
              <Input
                id="compensationRange"
                type="text"
                placeholder="$80k - $120k"
                value={compensationRange}
                onChange={(e) => setCompensationRange(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Posting job..." : "Post Job"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
