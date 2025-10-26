import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LavaBackground } from "@/components/lava-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"

export default async function CandidatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: students } = await supabase
    .from("student_profiles")
    .select(
      `
      *,
      profiles (
        full_name,
        email
      ),
      projects (
        id
      )
    `,
    )
    .limit(20)

  return (
    <div className="min-h-screen">
      <LavaBackground />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/startup">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Candidates</h1>
            <p className="text-muted-foreground">Discover talented student builders</p>
          </div>

          {!students || students.length === 0 ? (
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>No candidates yet</CardTitle>
                    <CardDescription>Check back soon as students join the platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {students.map((student: any) => (
                <Card
                  key={student.id}
                  className="backdrop-blur-sm bg-card/95 hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{student.profiles?.full_name || "Unknown"}</CardTitle>
                    <CardDescription className="line-clamp-2">{student.bio || "No bio available"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {student.school && <Badge variant="secondary">{student.school}</Badge>}
                      {student.graduation_year && <Badge variant="secondary">Class of {student.graduation_year}</Badge>}
                      {student.projects && <Badge variant="outline">{student.projects.length} Projects</Badge>}
                    </div>

                    {student.skills && student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {student.skills.slice(0, 5).map((skill: string) => (
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
        </div>
      </div>
    </div>
  )
}
