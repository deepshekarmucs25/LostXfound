"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare, Package, User, Loader2 } from "lucide-react"
import { authClient } from "@/server/better-auth/client"
import { cn } from "@/lib/utils"

interface Conversation {
  id: number
  item: {
    title: string
  }
  ownerId: string
  finderId: string
  messages?: Message[]
}

interface Message {
  id: number
  message: string
  senderId: string
  createdAt: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: session } = authClient.useSession()

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch(`/api/conversations?userId=${session.user.id}`)
      const data = await res.json()
      setConversations(data)
    } catch (error) {
      console.error("Conversations fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchConversations()
    // Removed 'messages' from here to satisfy biome/correctness
  }, [fetchConversations])

  const openConversation = async (conv: Conversation) => {
    setSelectedConversation(conv)
    try {
      const res = await fetch(`/api/messages?conversationId=${conv.id}`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error("Messages fetch error:", error)
    }
  }

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!text.trim() || !selectedConversation || !session?.user?.id) return

    setIsSending(true)
    const currentText = text
    setText("") 

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: session.user.id,
          message: currentText,
        }),
      })

      if (res.ok) {
        const newMessage = await res.json()
        setMessages((prev) => [...prev, newMessage])
      }
    } catch (error) {
      console.error("Failed to send:", error)
      setText(currentText) 
    } finally {
      setIsSending(false)
    }
  }

  if (!session) return (
    <div className="flex items-center justify-center h-[80vh] text-muted-foreground font-medium">
      Please sign in to view your messages.
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border rounded-2xl overflow-hidden bg-white shadow-xl h-full">
        
        {/* LEFT PANEL - Sidebar */}
        <div className="md:col-span-1 border-r bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" /> Chats
            </h2>
          </div>
          
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : conversations.length === 0 ? (
              <p className="p-6 text-sm text-center text-muted-foreground">No active chats yet.</p>
            ) : (
              conversations.map((conv) => (
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
<div
                  key={conv.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openConversation(conv)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openConversation(conv);
                    }
                  }}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-colors flex items-center gap-3 outline-none focus-visible:bg-slate-100",
                    selectedConversation?.id === conv.id ? "bg-white border-l-4 border-l-indigo-500" : "hover:bg-slate-100"
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm truncate">{conv.item?.title}</p>
                    <p className="text-xs text-slate-500 truncate">Click to view messages</p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* RIGHT PANEL - Chat Area */}
        <div className="md:col-span-3 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedConversation.item?.title}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Chat</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 md:p-6 bg-slate-50/30">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === session.user.id
                    return (
                      <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                          isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border text-slate-700 rounded-tl-none"
                        )}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSending}
                />
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6" disabled={!text.trim() || isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 space-y-4">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                <MessageSquare className="h-10 w-10 text-slate-200" />
              </div>
              <p className="font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}