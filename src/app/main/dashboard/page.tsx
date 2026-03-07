"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Item = {
  id: number
  title: string
  type: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [data, setData] = useState({
    lost: 0,
    found: 0,
    resolved: 0,
    recent: [] as Item[],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to fetch dashboard", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    // Max-width and centered padding for a professional "SaaS" feel
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      
      <header className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground">Overview of community activity and recent reports.</p>
      </header>

      {/* Stats Section: Using tighter headers and larger padding for the numbers */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { label: "Lost Items", value: data.lost, color: "text-red-600" },
          { label: "Found Items", value: data.found, color: "text-indigo-600" },
          { label: "Resolved", value: data.resolved, color: "text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className={cn("text-4xl font-bold tracking-tight", stat.color)}>
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Listings: Enhanced with list-style simplicity */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Recent Listings</h2>
          <Badge variant="outline" className="px-3 py-1 text-slate-500">
            Last 5 entries
          </Badge>
        </div>

        <div className="grid gap-3">
          {data.recent.map((item) => (
            <Card key={item.id} className="group hover:border-indigo-200 transition-colors shadow-none border-slate-100">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={cn(
                      "font-semibold uppercase text-[10px] px-2 py-0.5 rounded",
                      item.type === 'lost' ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700"
                    )}>
                      {item.type}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600">
                    {item.status}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {data.recent.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed rounded-xl text-slate-400">
              No recent activity found.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}