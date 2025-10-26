import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { LavaBackground } from "@/components/lava-background"

export default async function StudentDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.user_type !== "student") {
    redirect("/auth/login")
  }

  const { data: studentProfile } = await supabase.from("student_profiles").select("*").eq("id", user.id).single()

  if (!studentProfile) {
    redirect("/onboarding")
  }

  // Fetch student's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch student's voice portfolios
  const { data: voicePortfolios } = await supabase
    .from("voice_portfolios")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch student's applications
  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      *,
      job_postings (
        *,
        startup_profiles (
          company_name
        )
      )
    `,
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <LavaBackground />
      <StudentDashboard
        user={user}
        profile={profile}
        studentProfile={studentProfile}
        projects={projects || []}
        voicePortfolios={voicePortfolios || []}
        applications={applications || []}
      />
    </div>
  )
}
