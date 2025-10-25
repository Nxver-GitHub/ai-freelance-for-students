import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import PublishPortfolioButton from "@/components/publish-portfolio-button"

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: portfolio, error } = await supabase.from("portfolios").select("*").eq("id", id).single()

  if (error || !portfolio) {
    redirect("/dashboard")
  }

  // Check if user owns this portfolio
  const isOwner = portfolio.student_id === user.id

  const content = portfolio.ai_generated_content as any

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Badge variant={portfolio.is_published ? "default" : "secondary"}>
                  {portfolio.is_published ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </>
                  )}
                </Badge>
                <PublishPortfolioButton portfolioId={portfolio.id} isPublished={portfolio.is_published} />
              </div>
            )}
          </div>

          {/* Portfolio Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{portfolio.title}</CardTitle>
              <CardDescription className="text-base">{portfolio.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills */}
              {content?.skills && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {content?.projects && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Projects</h3>
                  <div className="space-y-4">
                    {content.projects.map((project: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <CardDescription>{project.role}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech: string) => (
                              <Badge key={tech} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Looking For */}
              {content?.lookingFor && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">What I'm Looking For</h3>
                  <p className="text-muted-foreground">{content.lookingFor}</p>
                </div>
              )}

              {/* Transcript */}
              {isOwner && portfolio.transcript && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Original Transcript</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground italic">"{portfolio.transcript}"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
