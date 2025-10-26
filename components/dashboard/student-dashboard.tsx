"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Settings, Plus, Briefcase, Mic, FolderGit2, LogOut, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ProjectCard } from "@/components/projects/project-card"
import { VoicePortfolioCard } from "@/components/voice/voice-portfolio-card"
import { ApplicationCard } from "@/components/applications/application-card"

interface StudentDashboardProps {
  user: User
  profile: any
  studentProfile: any
  projects: any[]
  voicePortfolios: any[]
  applications: any[]
}

export function StudentDashboard({
  user,
  profile,
  studentProfile,
  projects,
  voicePortfolios,
  applications,
}: StudentDashboardProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const initials =
    profile.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard/student" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-xl">BuilderSync</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/student/opportunities">
                <Briefcase className="w-4 h-4 mr-2" />
                Opportunities
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-muted-foreground mb-3">{studentProfile.bio || "No bio yet"}</p>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.school && <Badge variant="secondary">{studentProfile.school}</Badge>}
                    {studentProfile.graduation_year && (
                      <Badge variant="secondary">Class of {studentProfile.graduation_year}</Badge>
                    )}
                    {studentProfile.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/dashboard/student/projects/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/student/voice/new">
                      <Mic className="w-4 h-4 mr-2" />
                      Record Voice
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-card/95">
              <TabsTrigger value="projects">
                <FolderGit2 className="w-4 h-4 mr-2" />
                Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="w-4 h-4 mr-2" />
                Voice Portfolio ({voicePortfolios.length})
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Briefcase className="w-4 h-4 mr-2" />
                Applications ({applications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4 mt-6">
              {projects.length === 0 ? (
                <Card className="backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription>Start by adding your first project to showcase your work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/dashboard/student/projects/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Project
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="voice" className="space-y-4 mt-6">
              {voicePortfolios.length === 0 ? (
                <Card className="backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle>No voice recordings yet</CardTitle>
                    <CardDescription>
                      Record voice walkthroughs of your projects to stand out to startups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/dashboard/student/voice/new">
                        <Mic className="w-4 h-4 mr-2" />
                        Record Your First Voice Portfolio
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {voicePortfolios.map((voice) => (
                    <VoicePortfolioCard key={voice.id} voicePortfolio={voice} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4 mt-6">
              {applications.length === 0 ? (
                <Card className="backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle>No applications yet</CardTitle>
                    <CardDescription>Browse opportunities and apply to YC startups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/dashboard/student/opportunities">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Browse Opportunities
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
