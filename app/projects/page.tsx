import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, DollarSign, Clock, ArrowLeft } from "lucide-react"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all open projects with startup info
  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      startup:users!projects_startup_id_fkey(display_name, avatar_url),
      startup_profile:startup_profiles!projects_startup_id_fkey(company_name, is_yc_backed)
    `,
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold">
            BuilderSync
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Browse Projects</h1>
              <p className="text-muted-foreground mt-2">
                Discover opportunities from innovative startups and companies
              </p>
            </div>
            {user && (
              <Link href="/projects/new">
                <Button className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Post Project
                </Button>
              </Link>
            )}
          </div>

          {/* Projects Grid */}
          {!projects || projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for new opportunities!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project: any) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{project.startup_profile?.company_name || project.startup?.display_name}</span>
                            {project.startup_profile?.is_yc_backed && (
                              <Badge variant="secondary" className="text-xs">
                                YC
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-3 mt-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Budget */}
                      {(project.budget_min || project.budget_max) && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {project.budget_min && project.budget_max
                              ? `$${project.budget_min.toLocaleString()} - $${project.budget_max.toLocaleString()}`
                              : project.budget_min
                                ? `From $${project.budget_min.toLocaleString()}`
                                : `Up to $${project.budget_max.toLocaleString()}`}
                          </span>
                        </div>
                      )}

                      {/* Duration */}
                      {project.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{project.duration}</span>
                        </div>
                      )}

                      {/* Skills */}
                      {project.required_skills && project.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.required_skills.slice(0, 5).map((skill: string) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {project.required_skills.length > 5 && (
                            <Badge variant="outline">+{project.required_skills.length - 5} more</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
