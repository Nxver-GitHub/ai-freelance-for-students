import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MessagingInterface } from "@/components/messaging/messaging-interface"
import { LavaBackground } from "@/components/lava-background"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Fetch all conversations (unique users the current user has messaged with)
  const { data: sentMessages } = await supabase
    .from("messages")
    .select("recipient_id")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })

  const { data: receivedMessages } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })

  const conversationIds = new Set<string>()
  sentMessages?.forEach((msg) => conversationIds.add(msg.recipient_id))
  receivedMessages?.forEach((msg) => conversationIds.add(msg.sender_id))

  const conversationUserIds = Array.from(conversationIds)

  // Fetch profiles for all conversation participants
  const { data: conversationUsers } = conversationUserIds.length
    ? await supabase.from("profiles").select("*").in("id", conversationUserIds)
    : { data: [] }

  return (
    <div className="min-h-screen">
      <LavaBackground />
      <MessagingInterface user={user} profile={profile} conversationUsers={conversationUsers || []} />
    </div>
  )
}
