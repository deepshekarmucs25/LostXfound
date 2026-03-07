"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, 
  Search, 
  Map as MapIcon, 
  MessageCircle, 
  Bell, 
  User, 
  PlusCircle, 
  PackageSearch,
  Loader2,
  LogOut,
  ChevronsUpDown,
  Settings,
  CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/server/better-auth/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const { data: session, isPending } = authClient.useSession()

  const links = [
    { name: "Dashboard", href: "/main/dashboard", icon: Home },
    { name: "Lost Items", href: "/main/lost-items", icon: Search },
    { name: "Found Items", href: "/main/found-items", icon: PackageSearch },
  ]

  const accountLinks = [
    { name: "Messages", href: "/main/messages", icon: MessageCircle },
    { name: "Notifications", href: "/main/notifications", icon: Bell },
    { name: "Profile", href: "/main/profile", icon: User },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Force redirect to the specific signup path you requested
          router.push("/auth/signup")
        },
      },
    })
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50/50 p-4">
      <div className="mb-8 px-2 py-4 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-indigo-600">
          Lost<span className="text-slate-900">X</span>Found
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
          Community Portal
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <nav className="space-y-1">
          <p className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
            Discovery
          </p>
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-medium transition-all",
                  pathname === link.href 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <link.icon className={cn("h-4 w-4", pathname === link.href ? "text-indigo-600" : "text-slate-500")} />
                {link.name}
              </Button>
            </Link>
          ))}

          <Separator className="my-4" />
          
          <p className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
            Personal
          </p>
          {accountLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-medium",
                  pathname === link.href ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t">
          {isPending ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full h-auto flex items-center gap-3 px-2 py-3 rounded-lg bg-white border shadow-sm group transition-all hover:border-indigo-100 focus-visible:ring-0"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name} 
                      className="h-8 w-8 rounded-full ring-1 ring-slate-100" 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {getInitials(session.user.name || "User")}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden flex-1 text-left">
                    <span className="text-sm font-semibold truncate text-slate-900">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate lowercase">
                      {session.user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" align="end" side="top">
                <DropdownMenuLabel className="font-normal text-left">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground italic">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signup" className="block w-full">
              <Button variant="outline" className="w-full text-xs font-semibold">
                Sign Up for Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}