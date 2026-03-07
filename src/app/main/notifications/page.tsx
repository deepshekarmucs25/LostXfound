"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Inbox
} from "lucide-react"
import { authClient } from "@/server/better-auth/client"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: number
  userId: string
  type: "message" | "item_match" | "item_resolved" | "report_update"
  message: string
  isRead: boolean
  createdAt: string
  referenceId?: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = authClient.useSession()

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch(`/api/notifications?userId=${session.user.id}`)
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = async (id: number) => {
    try {
      // Optimistic Update: Change UI immediately
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
      
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  // Helper to render specific icons based on the schema Enum
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message": return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "item_match": return <Search className="h-5 w-5 text-amber-500" />
      case "item_resolved": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case "report_update": return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <Bell className="h-5 w-5 text-slate-500" />
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Please sign in to view your notifications.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-slate-900" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full" />
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {notifications.filter(n => !n.isRead).length} Unread
        </Badge>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
            <p className="text-slate-500">You don't have any notifications right now.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Card 
              key={n.id} 
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:shadow-md border-slate-100",
                !n.isRead ? "bg-indigo-50/40 border-indigo-100" : "bg-white"
              )}
              onClick={() => !n.isRead && markAsRead(n.id)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl shrink-0",
                  !n.isRead ? "bg-white shadow-sm" : "bg-slate-50"
                )}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {n.type.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    !n.isRead ? "text-slate-900 font-semibold" : "text-slate-600 font-medium"
                  )}>
                    {n.message}
                  </p>
                </div>

                {!n.isRead && (
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}