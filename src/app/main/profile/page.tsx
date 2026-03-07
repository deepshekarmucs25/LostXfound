"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Loader2, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Settings2,
  UploadCloud
} from "lucide-react"
import { authClient } from "@/server/better-auth/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
}

export default function ProfilePage() {
  const { data: session, isPending: authLoading } = authClient.useSession()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [open, setOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch(`/api/profile?userId=${session.user.id}`)
      const data = await res.json()
      setUser(data)
      setName(data.name || "")
      setPreviewUrl(data.image || "")
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) fetchProfile()
  }, [session, fetchProfile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const updateProfile = async () => {
    if (!session?.user?.id) return
    setIsUpdating(true)

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          name,
          avatar: previewUrl, 
        }),
      })

      if (res.ok) {
        toast.success("Profile updated perfectly")
        setOpen(false)
        fetchProfile()
      }
    } catch (error) {
      toast.error("Update failed")
    } finally {
      setIsUpdating(false)
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <Avatar className="h-32 w-32 ring-4 ring-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={user?.image || ""} className="object-cover" />
              <AvatarFallback className="bg-slate-100 text-slate-400">
                <UserIcon size={40} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{user?.name}</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Mail size={16} className="text-slate-400" /> {user?.email}
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
              <Settings2 size={18} /> Edit Profile
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-slate-900 text-white">
              <DialogTitle className="text-2xl font-bold">Update Profile</DialogTitle>
              <p className="text-slate-400 text-sm">Refine your digital identity.</p>
            </DialogHeader>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4 flex flex-col items-center">
                {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
<div 
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className="w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="h-full w-full object-cover rounded-[14px]" alt="Preview" />
                  ) : (
                    <>
                      <UploadCloud className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={32} />
                      <span className="text-xs font-semibold text-slate-500">Click to upload photo</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="rounded-xl border-slate-200 h-12 focus-visible:ring-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 flex gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
              <Button 
                onClick={updateProfile} 
                disabled={isUpdating}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-8"
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 rounded-3xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Account Status</h4>
                <p className="flex items-center gap-2 font-semibold text-slate-700">
                  <ShieldCheck className="text-emerald-500" size={18} /> Verified Professional
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Platform Role</h4>
                <p className="font-semibold text-slate-700 capitalize">{user?.role || "Member"}</p>
              </div>
            </div>
            
            <hr className="border-slate-100" />
            
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">About</h4>
              <p className="text-slate-600 leading-relaxed">
                This account is managed securely via Better Auth. All profile information is 
                synchronized with the LostXFound global database for item recovery and messaging.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200">
            <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Keep your profile updated with a clear photo to build trust when communicating with finders or owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}