import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mic, Briefcase, MessageSquare, User } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) {
    redirect("/onboarding")
  }

  const isStudent = userData.role === "student"

  // Fetch user-specific data
  let portfolios = null
  let projects = null

  if (isStudent) {
    const { data } = await supabase
      .from("portfolios")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
    portfolios = data
  } else {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("startup_id", user.id)
      .order("created_at", { ascending: false })
    projects = data
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            BuilderSync
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost">Browse Projects</Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData.display_name}!</h1>
            <p className="text-muted-foreground mt-2">
              {isStudent
                ? "Manage your portfolios and find exciting projects to work on."
                : "Post projects and connect with talented student builders."}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            {isStudent ? (
              <>
                <Link href="/portfolio/create">
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Mic className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Create Portfolio</CardTitle>
                      <CardDescription>Use AI voice technology to generate a professional portfolio</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/projects">
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Browse Projects</CardTitle>
                      <CardDescription>
                        Find exciting opportunities from YC startups and innovative companies
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            ) : (
              <>
                <Link href="/projects/new">
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Post a Project</CardTitle>
                      <CardDescription>Share your project and connect with talented student builders</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/projects">
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Browse Builders</CardTitle>
                      <CardDescription>Discover talented student developers and their portfolios</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            )}
          </div>

          {/* Recent Items */}
          {isStudent && portfolios && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Portfolios</h2>
              {portfolios.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't created any portfolios yet.</p>
                    <Link href="/portfolio/create">
                      <Button className="mt-4">Create Your First Portfolio</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {portfolios.map((portfolio) => (
                    <Link key={portfolio.id} href={`/portfolio/${portfolio.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle>{portfolio.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{portfolio.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isStudent && projects && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't posted any projects yet.</p>
                    <Link href="/projects/new">
                      <Button className="mt-4">Post Your First Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
