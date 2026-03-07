"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  CheckCircle2, 
  PlusCircle, 
  Loader2, 
  ImageIcon, 
  MapPin, 
  Search, 
  AlertCircle,
  Archive
} from "lucide-react"
import { authClient } from "@/server/better-auth/client"
import { ListingCard } from "@/app/_components/ListingCard"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Item = {
  id: number
  title: string
  description: string
  address: string
  itemImages?: string[]
  createdAt: string
}

export default function FoundItemsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [imageFile, setImageFile] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const { data: session } = authClient.useSession()

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/found-items")
      const data = await res.json()
      if (Array.isArray(data)) {
        setItems(data)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageError(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createItem = async () => {
    if (!imageFile) {
      setImageError(true)
      return
    }
    
    if (!title || !description || !session?.user?.id) return;
    
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/found-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          address,
          type: "found", // Explicitly setting the type for the schema
          userId: session.user.id,
          itemImages: [imageFile],
        }),
      })

      if (response.ok) {
        toast.success("Found item reported!")
        setTitle("")
        setDescription("")
        setAddress("")
        setImageFile(null)
        setOpen(false) 
        fetchItems()
      }
    } catch (error) {
      console.error("Failed to post found item:", error)
      toast.error("Failed to post report")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            Found Items <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </h1>
          <p className="text-muted-foreground">Help reunite lost belongings with their rightful owners.</p>
        </div>

        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setImageError(false); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md gap-2 px-6" disabled={!session}>
              <PlusCircle className="h-4 w-4" />
              {session ? "Report Found Item" : "Sign in to Report"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-slate-50/80 border-b text-left">
              <DialogTitle className="text-2xl font-bold">Post Found Item</DialogTitle>
              <DialogDescription className="text-slate-500">Be as descriptive as possible to verify the true owner.</DialogDescription>
            </DialogHeader>
            
            <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto text-left">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">What did you find?</Label>
                <Input placeholder="e.g. Blue Backpack" className="bg-white" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Recovery Location</Label>
                <div className="relative">
                  <Input placeholder="e.g. Library 2nd Floor" className="pl-9 bg-white" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn("text-[10px] uppercase font-bold tracking-widest", imageError ? "text-red-500" : "text-slate-400")}>
                  Item Photo (Compulsory)
                </Label>
                <div className={cn(
                  "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-colors bg-white",
                  imageError ? "border-red-500 bg-red-50/30" : "border-slate-200 hover:border-emerald-400"
                )}>
                  {imageFile ? (
                    <img src={imageFile} alt="Preview" className="h-32 w-32 object-cover rounded-lg mb-2" />
                  ) : (
                    <ImageIcon className={cn("h-8 w-8 mb-2", imageError ? "text-red-400" : "text-slate-300")} />
                  )}
                  <Input type="file" accept="image/*" className="text-xs border-none shadow-none cursor-pointer" onChange={handleImageChange} />
                  {imageError && (
                    <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Image is required for verification
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Detailed Description</Label>
                <Textarea placeholder="Describe the item but leave out one specific detail only the owner would know..." className="min-h-[100px] resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50/50 border-t gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={createItem} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 px-8">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Archive className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-800">Available to Claim</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Search className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No items found yet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.address || "Unknown Location"}
                price={0}
                image={item.itemImages?.[0] || ""} 
                // UPDATED: Now points to the same dynamic detail page as lost items
                onBook={() => router.push(`/main/items/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}