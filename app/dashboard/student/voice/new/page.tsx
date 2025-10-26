import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LavaBackground } from "@/components/lava-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VoiceRecorderContainer } from "@/components/voice/voice-recorder-container"

export default async function NewVoicePage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <VoiceRecorderContainer userId={user.id} />
        </div>
      </div>
    </div>
  )
}
