import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewJobForm } from "@/components/jobs/new-job-form"
import { LavaBackground } from "@/components/lava-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <LavaBackground />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/startup">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <NewJobForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}
