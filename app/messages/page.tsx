import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get all conversations (unique users the current user has messaged with)
  const { data: sentMessages } = await supabase
    .from("messages")
    .select("recipient_id, created_at")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })

  const { data: receivedMessages } = await supabase
    .from("messages")
    .select("sender_id, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })

  // Get unique user IDs
  const userIds = new Set<string>()
  sentMessages?.forEach((msg) => userIds.add(msg.recipient_id))
  receivedMessages?.forEach((msg) => userIds.add(msg.sender_id))

  // Fetch user details for all conversation partners
  const conversations = []
  for (const userId of userIds) {
    const { data: otherUser } = await supabase.from("users").select("*").eq("id", userId).single()

    if (otherUser) {
      // Get last message with this user
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      // Count unread messages from this user
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", userId)
        .eq("recipient_id", user.id)
        .eq("is_read", false)

      conversations.push({
        user: otherUser,
        lastMessage,
        unreadCount: unreadCount || 0,
      })
    }
  }

  // Sort by last message time
  conversations.sort((a, b) => {
    const timeA = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : 0
    const timeB = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : 0
    return timeB - timeA
  })

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground mt-2">Connect with startups and student builders</p>
          </div>

          {conversations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start connecting with others by browsing projects or portfolios.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Link key={conversation.user.id} href={`/messages/${conversation.user.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{conversation.user.display_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold truncate">{conversation.user.display_name}</h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
