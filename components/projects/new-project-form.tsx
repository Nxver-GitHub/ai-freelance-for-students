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

export function NewProjectForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [techStack, setTechStack] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: projectError } = await supabase.from("projects").insert({
        student_id: userId,
        title,
        description,
        tech_stack: techStack.split(",").map((s) => s.trim()),
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
      })

      if (projectError) throw projectError

      router.push("/dashboard/student")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Project</CardTitle>
        <CardDescription>Showcase your work and skills</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="My Awesome Project"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what your project does, the problem it solves, and your role..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                type="text"
                placeholder="React, TypeScript, Node.js, PostgreSQL (comma separated)"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate technologies with commas</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="demoUrl">Demo URL (optional)</Label>
              <Input
                id="demoUrl"
                type="url"
                placeholder="https://myproject.com"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding project..." : "Add Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
