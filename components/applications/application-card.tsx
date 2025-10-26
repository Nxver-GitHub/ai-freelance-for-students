import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar } from "lucide-react"

interface ApplicationCardProps {
  application: any
}

export function ApplicationCard({ application }: ApplicationCardProps) {
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
            <CardTitle className="text-xl">{application.job_postings?.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4" />
              {application.job_postings?.startup_profiles?.company_name}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Applied {new Date(application.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
