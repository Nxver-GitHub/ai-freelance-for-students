"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Mic, Sparkles, Building2, GraduationCap } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setEmailError("Please enter your email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email")
      return
    }

    // Navigate to sign-up with email pre-filled
    window.location.href = `/auth/sign-up?email=${encodeURIComponent(email)}`
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Navigation Header - GitHub style */}
      <header className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="font-semibold text-xl text-white">BuilderSync</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm text-[#c9d1d9] hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#for-students" className="text-sm text-[#c9d1d9] hover:text-white transition-colors">
                  For Students
                </Link>
                <Link href="#for-startups" className="text-sm text-[#c9d1d9] hover:text-white transition-colors">
                  For Startups
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm text-[#c9d1d9] hover:text-white transition-colors">
                Sign in
              </Link>
              <Button asChild className="bg-white text-[#0d1117] hover:bg-gray-100">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - GitHub style */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#161b22] to-[#0d1117]" />

        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build and ship your career on a{" "}
              <span className="bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
                single, collaborative platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#8b949e] mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect talented student builders with Y Combinator startups through voice-powered portfolios and AI
              interview prep.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
            >
              <div className="flex flex-col items-start w-full sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError("")
                    }}
                    className={`px-4 py-3 rounded-lg bg-white text-[#0d1117] w-full sm:w-80 focus:outline-none focus:ring-2 ${
                      emailError ? "ring-2 ring-red-500" : "focus:ring-[#f97316]"
                    }`}
                  />
                  <Button
                    type="submit"
                    className="bg-[#2ea043] hover:bg-[#2c974b] text-white px-6 py-3 whitespace-nowrap"
                  >
                    Sign up for BuilderSync
                  </Button>
                </div>
                {emailError && <p className="text-red-500 text-sm mt-2 ml-1">{emailError}</p>}
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                asChild
                className="border-[#30363d] text-white hover:bg-[#21262d] hover:text-white bg-transparent"
              >
                <Link href="/auth/sign-up?type=student">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  I'm a Student Builder
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-[#30363d] text-white hover:bg-[#21262d] hover:text-white bg-transparent"
              >
                <Link href="/auth/sign-up?type=startup">
                  <Building2 className="w-4 h-4 mr-2" />
                  I'm a YC Startup
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f97316] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#fb923c] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-[#0d1117]">
        <div className="container mx-auto px-6">
          {/* Main Feature Showcase */}
          <div className="max-w-6xl mx-auto mb-32">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Your voice tells your story</h2>
              <p className="text-xl text-[#8b949e] max-w-3xl mx-auto leading-relaxed">
                Record voice walkthroughs of your projects. Let startups hear your passion, understand your thinking,
                and see the builder behind the code.
              </p>
            </div>

            {/* Visual Demo Area */}
            <div className="relative rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8 overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316] rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-[#f97316]" />
                    </div>
                    <span className="text-sm font-medium text-[#f97316]">Voice Portfolio</span>
                  </div>

                  <h3 className="text-3xl font-bold text-white">Stand out from the resume pile</h3>

                  <p className="text-[#8b949e] leading-relaxed">
                    Traditional resumes can't capture your enthusiasm or explain your technical decisions. With voice
                    portfolios, you can walk through your projects, explain your architecture choices, and showcase your
                    communication skills—all in one place.
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white">
                      <Link href="/auth/sign-up?type=student">
                        Create your portfolio
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Mock Voice Player */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c]" />
                    <div>
                      <p className="text-white font-medium">Sarah Chen</p>
                      <p className="text-sm text-[#8b949e]">Full-Stack Developer</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-[#c9d1d9]">Project: Real-time Collaboration Tool</p>
                    <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-[#f97316] rounded-full" />
                    </div>
                    <p className="text-xs text-[#8b949e]">1:24 / 4:12</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-0.5" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#30363d] rounded-full"
                          style={{ height: `${Math.random() * 24 + 8}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Interview Prep Showcase */}
          <div className="max-w-6xl mx-auto mb-32">
            <div className="relative rounded-xl border border-[#30363d] bg-gradient-to-br from-[#0d1117] to-[#161b22] p-8 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f97316] rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                {/* Mock AI Chat Interface */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 space-y-4 order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#f97316]" />
                    <span className="text-sm font-medium text-[#f97316]">AI Interview Coach</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#161b22] rounded-lg p-3 border border-[#30363d]">
                      <p className="text-sm text-[#c9d1d9]">"Tell me about your real-time collaboration project."</p>
                    </div>

                    <div className="bg-[#f97316]/10 rounded-lg p-3 border border-[#f97316]/20">
                      <p className="text-sm text-[#c9d1d9] mb-2">Great start! Here's how to improve your answer:</p>
                      <ul className="text-xs text-[#8b949e] space-y-1 ml-4">
                        <li>• Mention the specific WebSocket implementation</li>
                        <li>• Quantify the performance improvements</li>
                        <li>• Explain the scaling challenges you solved</li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                      <div className="w-2 h-2 rounded-full bg-[#2ea043] animate-pulse" />
                      <span>Analyzing your response...</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 order-1 md:order-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#f97316]" />
                    </div>
                    <span className="text-sm font-medium text-[#f97316]">AI-Powered Coaching</span>
                  </div>

                  <h3 className="text-3xl font-bold text-white">Practice makes perfect</h3>

                  <p className="text-[#8b949e] leading-relaxed">
                    Our AI interview coach analyzes your voice portfolio and creates personalized practice questions
                    based on your actual projects. Get real-time feedback on your answers and improve your interview
                    skills before the real thing.
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#30363d] text-white hover:bg-[#21262d] hover:text-white bg-transparent"
                    >
                      <Link href="/auth/sign-up?type=student">
                        Start practicing
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-[#8b949e]">YC Startups</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10k+</div>
                <div className="text-[#8b949e]">Student Builders</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">85%</div>
                <div className="text-[#8b949e]">Interview Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section id="for-students" className="relative py-24 bg-[#161b22]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">For Student Builders</h2>
              <p className="text-xl text-[#8b949e] mb-8 leading-relaxed">
                Showcase your projects with voice walkthroughs, practice interviews with AI, and connect directly with
                YC startups looking for talent like you.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Create voice-powered project portfolios that stand out</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Get personalized AI interview coaching based on your work</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Apply to roles at top YC startups with one click</span>
                </li>
              </ul>
              <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white">
                <Link href="/auth/sign-up?type=student">
                  Get started as a student
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-8 h-96 flex items-center justify-center">
              <p className="text-[#8b949e] text-center">Student Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Startups Section */}
      <section id="for-startups" className="relative py-24 bg-[#0d1117]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 h-96 flex items-center justify-center order-2 md:order-1">
              <p className="text-[#8b949e] text-center">Startup Dashboard Preview</p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">For YC Startups</h2>
              <p className="text-xl text-[#8b949e] mb-8 leading-relaxed">
                Find talented student builders who are passionate about their craft. Review voice portfolios, post
                opportunities, and hire faster.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Access a curated pool of talented student builders</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Review voice portfolios to understand candidates better</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#f97316] mt-1 flex-shrink-0" />
                  <span className="text-[#c9d1d9]">Post opportunities and connect directly with applicants</span>
                </li>
              </ul>
              <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white">
                <Link href="/auth/sign-up?type=startup">
                  Get started as a startup
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#0d1117] to-[#161b22]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-[#8b949e] mb-8">
              Join BuilderSync today and connect with the best talent or opportunities in the YC ecosystem.
            </p>
            <Button asChild size="lg" className="bg-[#f97316] hover:bg-[#ea580c] text-white text-lg px-8">
              <Link href="/auth/sign-up">
                Sign up for free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="font-semibold text-white">BuilderSync</span>
              </div>
              <p className="text-sm text-[#8b949e]">Built for builders, by builders.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#for-students" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    For Students
                  </Link>
                </li>
                <li>
                  <Link href="#for-startups" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    For Startups
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#8b949e] hover:text-[#f97316] transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#30363d] pt-8">
            <p className="text-sm text-[#8b949e] text-center">© 2025 BuilderSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
