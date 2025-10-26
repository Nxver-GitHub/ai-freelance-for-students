"use client"

import type React from "react"

import type { User } from "@supabase/supabase-js"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowLeft, Send, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface MessagingInterfaceProps {
  user: User
  profile: any
  conversationUsers: any[]
}

export function MessagingInterface({ user, profile, conversationUsers }: MessagingInterfaceProps) {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    conversationUsers.length > 0 ? conversationUsers[0].id : null,
  )
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const dashboardUrl = profile.user_type === "student" ? "/dashboard/student" : "/dashboard/startup"

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId)
      // Set up real-time subscription
      const supabase = createClient()
      const channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${selectedUserId},recipient_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new])
            scrollToBottom()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedUserId, user.id])

  const loadMessages = async (otherUserId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .or(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
      .order("created_at", { ascending: true })

    if (data) {
      const filteredMessages = data.filter(
        (msg) =>
          (msg.sender_id === user.id && msg.recipient_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.recipient_id === user.id),
      )
      setMessages(filteredMessages)
      scrollToBottom()

      // Mark messages as read
      await supabase.from("messages").update({ is_read: true }).eq("recipient_id", user.id).eq("sender_id", otherUserId)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id: selectedUserId,
          content: newMessage.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setMessages((prev) => [...prev, data])
      setNewMessage("")
      scrollToBottom()
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedUser = conversationUsers.find((u) => u.id === selectedUserId)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={dashboardUrl} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-xl">BuilderSync</span>
          </Link>

          <Button variant="ghost" asChild>
            <Link href={dashboardUrl}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="backdrop-blur-sm bg-card/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {conversationUsers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {conversationUsers.map((convUser) => {
                        const initials =
                          convUser.full_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "U"

                        return (
                          <button
                            key={convUser.id}
                            onClick={() => setSelectedUserId(convUser.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              selectedUserId === convUser.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted"
                            }`}
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{convUser.full_name}</p>
                              <p className="text-xs text-muted-foreground">{convUser.user_type}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="backdrop-blur-sm bg-card/95 flex flex-col">
              {selectedUser ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {selectedUser.full_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedUser.full_name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{selectedUser.user_type}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwn = message.sender_id === user.id
                          return (
                            <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                                >
                                  {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>

                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
