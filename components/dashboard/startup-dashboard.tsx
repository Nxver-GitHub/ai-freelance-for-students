"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Settings, Plus, Briefcase, Users, LogOut, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { JobPostingCard } from "@/components/jobs/job-posting-card"
import { StartupApplicationCard } from "@/components/applications/startup-application-card"

interface StartupDashboardProps {
  user: User
  profile: any
  startupProfile: any
  jobPostings: any[]
  applications: any[]
}

export function StartupDashboard({ user, profile, startupProfile, jobPostings, applications }: StartupDashboardProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const initials =
    startupProfile.company_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "S"

  const activeJobs = jobPostings.filter((job) => job.is_active).length
  const pendingApplications = applications.filter((app) => app.status === "pending").length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard/startup" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-xl">BuilderSync</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/startup/candidates">
                <Users className="w-4 h-4 mr-2" />
                Browse Candidates
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
                  <h1 className="text-3xl font-bold mb-2">{startupProfile.company_name}</h1>
                  <p className="text-muted-foreground mb-3">
                    {startupProfile.company_description || "No description yet"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {startupProfile.yc_batch && <Badge variant="secondary">YC {startupProfile.yc_batch}</Badge>}
                    {startupProfile.industry && <Badge variant="outline">{startupProfile.industry}</Badge>}
                    {startupProfile.company_size && <Badge variant="outline">{startupProfile.company_size}</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/dashboard/startup/jobs/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader className="pb-3">
                <CardDescription>Active Jobs</CardDescription>
                <CardTitle className="text-3xl">{activeJobs}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader className="pb-3">
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className="text-3xl">{applications.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader className="pb-3">
                <CardDescription>Pending Review</CardDescription>
                <CardTitle className="text-3xl">{pendingApplications}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 backdrop-blur-sm bg-card/95">
              <TabsTrigger value="jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Postings ({jobPostings.length})
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Users className="w-4 h-4 mr-2" />
                Applications ({applications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4 mt-6">
              {jobPostings.length === 0 ? (
                <Card className="backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle>No job postings yet</CardTitle>
                    <CardDescription>Create your first job posting to start finding talented builders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/dashboard/startup/jobs/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <JobPostingCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4 mt-6">
              {applications.length === 0 ? (
                <Card className="backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle>No applications yet</CardTitle>
                    <CardDescription>Applications will appear here once students apply to your jobs</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <StartupApplicationCard key={application.id} application={application} />
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
