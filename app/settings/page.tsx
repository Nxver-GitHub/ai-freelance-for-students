import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, User, Building2 } from "lucide-react"
import StudentProfileForm from "@/components/student-profile-form"
import StartupProfileForm from "@/components/startup-profile-form"
import SignOutButton from "@/components/sign-out-button"

export default async function SettingsPage() {
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

  // Fetch role-specific profile
  let profile = null
  if (isStudent) {
    const { data } = await supabase.from("student_profiles").select("*").eq("id", user.id).single()
    profile = data
  } else {
    const { data } = await supabase.from("startup_profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold">
            BuilderSync
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and profile information</p>
          </div>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{userData.display_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize">{userData.role}</p>
              </div>
              <div className="pt-4">
                <SignOutButton />
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          {isStudent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Profile
                </CardTitle>
                <CardDescription>Update your student profile and skills</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentProfileForm userId={user.id} initialData={profile} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Profile
                </CardTitle>
                <CardDescription>Update your company information</CardDescription>
              </CardHeader>
              <CardContent>
                <StartupProfileForm userId={user.id} initialData={profile} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
