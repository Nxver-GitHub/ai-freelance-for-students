import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import VoicePortfolioRecorder from "@/components/voice-portfolio-recorder"

export default async function CreatePortfolioPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is a student
  const { data: user } = await supabase.from("users").select("role").eq("id", data.user.id).single()

  if (user?.role !== "student") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-4xl font-bold">Create Your Portfolio</h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your projects and experience. Our AI will create a professional portfolio for you in
              minutes.
            </p>
          </div>
          <VoicePortfolioRecorder userId={data.user.id} />
        </div>
      </div>
    </div>
  )
}
