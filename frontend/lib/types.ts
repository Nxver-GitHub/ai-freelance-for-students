export type UserRole = "student" | "startup"

export interface User {
  id: string
  email: string
  role: UserRole
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  university: string | null
  graduation_year: number | null
  major: string | null
  skills: string[] | null
  github_url: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  bio: string | null
  hourly_rate: number | null
  availability: "full-time" | "part-time" | "contract" | null
}

export interface StartupProfile {
  id: string
  company_name: string
  company_website: string | null
  company_size: "1-10" | "11-50" | "51-200" | "200+" | null
  industry: string | null
  yc_batch: string | null
  is_yc_backed: boolean
  description: string | null
}

export interface Portfolio {
  id: string
  student_id: string
  title: string
  description: string | null
  audio_url: string | null
  transcript: string | null
  ai_generated_content: any
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  startup_id: string
  title: string
  description: string
  budget_min: number | null
  budget_max: number | null
  duration: string | null
  required_skills: string[] | null
  status: "open" | "in-progress" | "completed" | "closed"
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  project_id: string
  student_id: string
  cover_letter: string | null
  proposed_rate: number | null
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  created_at: string
}
