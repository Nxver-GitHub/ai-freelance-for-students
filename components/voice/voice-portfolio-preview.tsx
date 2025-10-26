"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Check, Edit2, Sparkles } from "lucide-react"

interface VoicePortfolioPreviewProps {
  portfolioData: any
  onApprove: () => void
  onEdit: () => void
}

export function VoicePortfolioPreview({ portfolioData, onApprove, onEdit }: VoicePortfolioPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    summary: portfolioData.ai_analysis?.summary || "",
    skills: portfolioData.ai_analysis?.skills || [],
    projects: portfolioData.ai_analysis?.projects || [],
  })

  return (
    <div className="space-y-6">
      {/* AI Generated Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">AI-Generated Portfolio Preview</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel Edit" : "Edit"}
        </Button>
      </div>

      {/* Audio Playback */}
      <Card className="backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>Your Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <audio src={portfolioData.audio_url} controls className="w-full" />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>About You</CardTitle>
          <CardDescription>AI-generated summary from your recording</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedData.summary}
              onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
              rows={4}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">{editedData.summary}</p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>Extracted Skills</CardTitle>
          <CardDescription>Skills identified from your recording</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {editedData.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>Projects Mentioned</CardTitle>
          <CardDescription>Projects extracted from your recording</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editedData.projects.map((project: any, index: number) => (
            <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
              {isEditing ? (
                <>
                  <Input
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...editedData.projects]
                      newProjects[index].title = e.target.value
                      setEditedData({ ...editedData, projects: newProjects })
                    }}
                    placeholder="Project title"
                  />
                  <Textarea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...editedData.projects]
                      newProjects[index].description = e.target.value
                      setEditedData({ ...editedData, projects: newProjects })
                    }}
                    placeholder="Project description"
                    rows={2}
                  />
                </>
              ) : (
                <>
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  {project.impact && <p className="text-sm text-primary font-medium">Impact: {project.impact}</p>}
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transcript */}
      <Card className="backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>Full Transcript</CardTitle>
          <CardDescription>Complete transcription of your recording</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {portfolioData.transcript}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onEdit}>
          Record Again
        </Button>
        <Button onClick={onApprove} size="lg" className="gap-2">
          <Check className="w-5 h-5" />
          Approve & Publish
        </Button>
      </div>
    </div>
  )
}
