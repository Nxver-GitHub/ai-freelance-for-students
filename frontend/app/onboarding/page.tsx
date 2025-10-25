import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user profile exists
  const { data: existingUser } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  // If profile doesn't exist, create it
  if (!existingUser) {
    const role = data.user.user_metadata?.role || "student"
    const displayName = data.user.user_metadata?.display_name || data.user.email?.split("@")[0]

    await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email!,
      role: role,
      display_name: displayName,
    })

    // Create role-specific profile
    if (role === "student") {
      await supabase.from("student_profiles").insert({
        id: data.user.id,
      })
      redirect("/portfolio/create")
    } else {
      await supabase.from("startup_profiles").insert({
        id: data.user.id,
        company_name: displayName,
      })
      redirect("/dashboard")
    }
  }

  // User already has profile, redirect based on role
  if (existingUser.role === "student") {
    redirect("/portfolio/create")
  } else {
    redirect("/dashboard")
  }
}
