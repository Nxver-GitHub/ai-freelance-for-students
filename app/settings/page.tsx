import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ThemeSelector } from "@/components/theme-selector"
import { LavaBackground } from "@/components/lava-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage() {
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

  const dashboardUrl = profile.user_type === "student" ? "/dashboard/student" : "/dashboard/startup"

  return (
    <div className="min-h-screen">
      <LavaBackground />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href={dashboardUrl}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Customize your BuilderSync experience</p>
            </div>

            <ThemeSelector />
          </div>
        </div>
      </div>
    </div>
  )
}
