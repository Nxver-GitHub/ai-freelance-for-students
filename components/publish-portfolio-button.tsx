"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

interface PublishPortfolioButtonProps {
  portfolioId: string
  isPublished: boolean
}

export default function PublishPortfolioButton({ portfolioId, isPublished }: PublishPortfolioButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const togglePublish = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("portfolios").update({ is_published: !isPublished }).eq("id", portfolioId)

    if (!error) {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button onClick={togglePublish} disabled={loading} className="gap-2">
      {isPublished ? (
        <>
          <EyeOff className="h-4 w-4" />
          Unpublish
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  )
}
