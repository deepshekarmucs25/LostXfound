"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { authClient } from "@/server/better-auth/client"

export default function ChatPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params)
  const router = useRouter()
  const { data: session } = authClient.useSession()
  
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  // This is where you will fetch your messages later
  useEffect(() => {
    if (conversationId) {
      setLoading(false)
    }
  }, [conversationId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-slate-400" />
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.push("/main/messages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-bold text-slate-900">Chat Session</h2>
          <p className="text-xs text-slate-500">ID: {conversationId}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <div className="bg-white p-4 rounded-2xl shadow-sm border max-w-[80%]">
          <p className="text-sm text-slate-600">
            Start of your conversation for item #{conversationId}.
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input 
            placeholder="Type your message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-full bg-slate-100 border-none focus-visible:ring-indigo-500"
          />
          <Button size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}