import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StartupDashboard } from "@/components/dashboard/startup-dashboard"
import { LavaBackground } from "@/components/lava-background"

export default async function StartupDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.user_type !== "startup") {
    redirect("/auth/login")
  }

  const { data: startupProfile } = await supabase.from("startup_profiles").select("*").eq("id", user.id).single()

  if (!startupProfile) {
    redirect("/onboarding")
  }

  // Fetch startup's job postings
  const { data: jobPostings } = await supabase
    .from("job_postings")
    .select("*")
    .eq("startup_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch applications to startup's jobs
  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      *,
      job_postings!inner (
        id,
        title,
        startup_id
      ),
      student_profiles (
        *,
        profiles (
          full_name,
          email
        )
      )
    `,
    )
    .eq("job_postings.startup_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <LavaBackground />
      <StartupDashboard
        user={user}
        profile={profile}
        startupProfile={startupProfile}
        jobPostings={jobPostings || []}
        applications={applications || []}
      />
    </div>
  )
}
