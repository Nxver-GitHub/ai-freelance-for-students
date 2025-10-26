import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar } from "lucide-react"
import Link from "next/link"

interface StartupApplicationCardProps {
  application: any
}

export function StartupApplicationCard({ application }: StartupApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "reviewed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "interview":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5" />
              {application.student_profiles?.profiles?.full_name || "Unknown"}
            </CardTitle>
            <CardDescription className="mt-1">
              Applied for: {application.job_postings?.title || "Unknown Position"}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {application.student_profiles?.profiles?.email}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Applied {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>

        {application.student_profiles?.skills && application.student_profiles.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {application.student_profiles.skills.slice(0, 5).map((skill: string) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/startup/applications/${application.id}`}>View Application</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
