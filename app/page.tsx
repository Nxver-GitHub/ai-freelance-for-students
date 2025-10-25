import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Briefcase, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">BuilderSync</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Connect Student Builders with <span className="text-primary">YC Startups</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            The marketplace where talented student developers meet innovative startups. Create your portfolio in minutes
            using AI-powered voice technology.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/auth/sign-up?role=student">
              <Button size="lg" className="gap-2">
                <Mic className="h-5 w-5" />
                I'm a Student Builder
              </Button>
            </Link>
            <Link href="/auth/sign-up?role=startup">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Briefcase className="h-5 w-5" />
                I'm a Startup
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Voice-Powered Portfolios</h3>
            <p className="text-muted-foreground">
              Simply talk about your projects and let AI generate a professional portfolio in minutes. No writing
              required.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Quality Projects</h3>
            <p className="text-muted-foreground">
              Access exclusive opportunities from YC-backed startups and innovative companies looking for talented
              builders.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Direct Connections</h3>
            <p className="text-muted-foreground">
              Message directly with founders and hiring managers. Build relationships that lead to real opportunities.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center space-y-6 bg-primary text-primary-foreground">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join hundreds of student builders and startups already using BuilderSync to find their perfect match.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 BuilderSync. Built for builders, by builders.</p>
        </div>
      </footer>
    </div>
  )
}
