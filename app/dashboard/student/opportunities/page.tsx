import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LavaBackground } from "@/components/lava-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Briefcase } from "lucide-react"

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: jobPostings } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      startup_profiles (
        company_name,
        company_description,
        yc_batch
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <LavaBackground />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
            <p className="text-muted-foreground">Browse open roles at YC startups</p>
          </div>

          {!jobPostings || jobPostings.length === 0 ? (
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>No opportunities yet</CardTitle>
                    <CardDescription>Check back soon for new postings from YC startups</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobPostings.map((job: any) => (
                <Card key={job.id} className="backdrop-blur-sm bg-card/95 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription>
                      {job.startup_profiles?.company_name}
                      {job.startup_profiles?.yc_batch && ` • ${job.startup_profiles.yc_batch}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                    <Button asChild>
                      <Link href={`/dashboard/student/opportunities/${job.id}`}>View Details</Link>
                    </Button>
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
