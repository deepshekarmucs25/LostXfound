"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, MessageCircle, ArrowLeft, Loader2 } from "lucide-react"
import { authClient } from "@/server/better-auth/client"
import { toast } from "sonner"

type Item = {
  id: number
  title: string
  description: string
  address: string
  itemImages?: string[]
  userId: string
}

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15 unwrap params using 'use'
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStartingChat, setIsStartingChat] = useState(false)

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setItem(data)
    } catch (err) {
      toast.error("Item not found")
      // UPDATED: Added /main prefix to redirect
      router.push("/main/lost-items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItem()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, [fetchItem]) // Changed dependency to id for better reactivity

  const startConversation = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to contact the finder")
      return
    }
    
    // Safety check for item and the owner's ID to prevent 400 errors
    if (!item || !item.userId) {
      toast.error("Item owner information is missing")
      return
    }

    setIsStartingChat(true)
    try {
      const res = await fetch("/api/conversations/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          ownerId: item.userId,
          senderId: session.user.id,
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to start conversation")
      }

      if (data.conversationId) {
        // UPDATED: Added /main prefix to redirect
        router.push(`/main/messages/${data.conversationId}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start conversation")
    } finally {
      setIsStartingChat(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  )

  if (!item) return null

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Designer Header Space */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full gap-2 text-slate-500 mb-8">
          <ArrowLeft size={18} /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* World-class Image Padding & Shadow */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-8 border-white group">
            <img
              src={item.itemImages?.[0] || "/placeholder.jpg"}
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              alt={item.title}
            />
          </div>

          {/* Typography & Content */}
          <div className="space-y-8 py-4 text-left">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 w-fit px-5 py-2.5 rounded-full text-sm">
                <MapPin size={18} />
                {item.address}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Description</h4>
              <p className="text-slate-600 leading-relaxed text-lg">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <Button
                className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                onClick={startConversation}
                disabled={isStartingChat}
              >
                {isStartingChat ? <Loader2 className="mr-2 animate-spin" /> : <MessageCircle className="mr-2" />}
                Contact Finder
              </Button>

              <Button
                variant="outline"
                className="h-16 rounded-2xl border-slate-200 hover:bg-slate-100 transition-all text-slate-600 font-semibold"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`,
                    "_blank"
                  )
                }
              >
                <MapPin className="mr-2 h-5 w-5" />
                See Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}