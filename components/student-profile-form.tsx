"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { StudentProfile } from "@/lib/types"

interface StudentProfileFormProps {
  userId: string
  initialData: StudentProfile | null
}

export default function StudentProfileForm({ userId, initialData }: StudentProfileFormProps) {
  const [university, setUniversity] = useState(initialData?.university || "")
  const [graduationYear, setGraduationYear] = useState(initialData?.graduation_year?.toString() || "")
  const [major, setMajor] = useState(initialData?.major || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url || "")
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedin_url || "")
  const [portfolioUrl, setPortfolioUrl] = useState(initialData?.portfolio_url || "")
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourly_rate?.toString() || "")
  const [availability, setAvailability] = useState<string>(initialData?.availability || "")
  const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
  const [skillInput, setSkillInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("student_profiles")
        .update({
          university: university || null,
          graduation_year: graduationYear ? Number.parseInt(graduationYear) : null,
          major: major || null,
          bio: bio || null,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          portfolio_url: portfolioUrl || null,
          hourly_rate: hourlyRate ? Number.parseFloat(hourlyRate) : null,
          availability: availability || null,
          skills: skills.length > 0 ? skills : null,
        })
        .eq("id", userId)

      if (updateError) throw updateError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            placeholder="e.g., Stanford University"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Input
            id="graduationYear"
            type="number"
            placeholder="2025"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="major">Major</Label>
        <Input
          id="major"
          placeholder="e.g., Computer Science"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your interests, and what you're looking for..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <div className="flex gap-2">
          <Input
            id="skills"
            placeholder="e.g., React, Python, TypeScript"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill()
              }
            }}
          />
          <Button type="button" onClick={addSkill} variant="secondary">
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            placeholder="50"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          type="url"
          placeholder="https://github.com/username"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio URL</Label>
        <Input
          id="portfolioUrl"
          type="url"
          placeholder="https://yourportfolio.com"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
        />
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
