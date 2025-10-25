import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MessageThread from "@/components/message-thread"

export default async function ConversationPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch the other user's details
  const { data: otherUser, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error || !otherUser) {
    redirect("/messages")
  }

  // Fetch all messages between these two users
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true })

  // Mark messages from other user as read
  await supabase.from("messages").update({ is_read: true }).eq("sender_id", userId).eq("recipient_id", user.id)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/messages">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{otherUser.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{otherUser.display_name}</h2>
                <p className="text-xs text-muted-foreground">{otherUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message Thread */}
      <MessageThread currentUserId={user.id} otherUserId={userId} initialMessages={messages || []} />
    </div>
  )
}
