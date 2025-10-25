import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, DollarSign, Clock, Building2 } from "lucide-react"
import ApplicationForm from "@/components/application-form"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch project with startup info
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      startup:users!projects_startup_id_fkey(id, display_name, email, avatar_url),
      startup_profile:startup_profiles!projects_startup_id_fkey(company_name, company_website, is_yc_backed, yc_batch, description)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !project) {
    redirect("/projects")
  }

  // Check if user is the project owner
  const isOwner = user?.id === project.startup_id

  // Check if user is a student
  let isStudent = false
  let hasApplied = false
  if (user) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()
    isStudent = userData?.role === "student"

    if (isStudent) {
      const { data: application } = await supabase
        .from("applications")
        .select("id")
        .eq("project_id", id)
        .eq("student_id", user.id)
        .single()
      hasApplied = !!application
    }
  }

  // Fetch applications if owner
  let applications = null
  if (isOwner) {
    const { data } = await supabase
      .from("applications")
      .select(
        `
        *,
        student:users!applications_student_id_fkey(display_name, email),
        student_profile:student_profiles!applications_student_id_fkey(university, skills, hourly_rate)
      `,
      )
      .eq("project_id", id)
      .order("created_at", { ascending: false })
    applications = data
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold">
            BuilderSync
          </Link>
          <Link href="/projects">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{project.title}</CardTitle>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{project.startup_profile?.company_name || project.startup?.display_name}</span>
                    {project.startup_profile?.is_yc_backed && (
                      <Badge variant="secondary">YC {project.startup_profile.yc_batch}</Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant={
                    project.status === "open" ? "default" : project.status === "in-progress" ? "secondary" : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>

              {/* Budget & Duration */}
              <div className="grid md:grid-cols-2 gap-4">
                {(project.budget_min || project.budget_max) && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">
                        {project.budget_min && project.budget_max
                          ? `$${project.budget_min.toLocaleString()} - $${project.budget_max.toLocaleString()}`
                          : project.budget_min
                            ? `From $${project.budget_min.toLocaleString()}`
                            : `Up to $${project.budget_max.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{project.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Skills */}
              {project.required_skills && project.required_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.required_skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              {project.startup_profile?.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About the Company</h3>
                  <p className="text-muted-foreground">{project.startup_profile.description}</p>
                  {project.startup_profile.company_website && (
                    <a
                      href={project.startup_profile.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Form for Students */}
          {isStudent && !hasApplied && project.status === "open" && (
            <ApplicationForm projectId={project.id} userId={user!.id} />
          )}

          {hasApplied && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You have already applied to this project.</p>
              </CardContent>
            </Card>
          )}

          {/* Applications List for Project Owner */}
          {isOwner && applications && (
            <Card>
              <CardHeader>
                <CardTitle>Applications ({applications.length})</CardTitle>
                <CardDescription>Review applications from interested students</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{app.student?.display_name}</CardTitle>
                              <CardDescription>{app.student?.email}</CardDescription>
                            </div>
                            <Badge
                              variant={
                                app.status === "accepted"
                                  ? "default"
                                  : app.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {app.student_profile?.university && (
                            <p className="text-sm text-muted-foreground">{app.student_profile.university}</p>
                          )}
                          {app.cover_letter && (
                            <div>
                              <p className="text-sm font-medium mb-1">Cover Letter:</p>
                              <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                            </div>
                          )}
                          {app.proposed_rate && (
                            <p className="text-sm">
                              <span className="font-medium">Proposed Rate:</span> ${app.proposed_rate}/hr
                            </p>
                          )}
                          {app.student_profile?.skills && app.student_profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {app.student_profile.skills.map((skill: string) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
