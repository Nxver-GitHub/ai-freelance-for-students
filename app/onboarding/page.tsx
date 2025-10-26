import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentOnboarding } from "@/components/onboarding/student-onboarding"
import { StartupOnboarding } from "@/components/onboarding/startup-onboarding"
import { LavaBackground } from "@/components/lava-background"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <LavaBackground />
      {profile.user_type === "student" ? (
        <StudentOnboarding userId={user.id} userEmail={user.email!} />
      ) : (
        <StartupOnboarding userId={user.id} userEmail={user.email!} />
      )}
    </div>
  )
}
