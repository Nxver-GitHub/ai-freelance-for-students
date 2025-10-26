import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LavaBackground } from "@/components/lava-background"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LavaBackground />

      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <span className="font-semibold text-2xl">BuilderSync</span>
            </Link>
          </div>

          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We've sent you a confirmation link to verify your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Click the link in your email to confirm your account and complete your profile setup. The link will
                expire in 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
