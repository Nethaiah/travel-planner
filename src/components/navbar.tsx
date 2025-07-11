"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/app/server/userActions"
import { useSession } from "@/lib/auth-client"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Method using useEffect to get session from server
  // const [session, setSession] = useState<any>(null)
  // const [isPending, setIsPending] = useState(true)

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const session = await getSession()
  //     setSession(session)
  //     setIsPending(false)
  //   }
  //   fetchSession()
  // }, [])

  function getInitials(name : string){
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/")
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isPending, session, router])

  const handleSignOut = async () => {
    await logout()
    router.push("/login")
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Plane className="h-6 w-6 text-blue-600 transition-transform group-hover:rotate-12 duration-300" />
              <div className="absolute inset-0 bg-blue-600/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-xl text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
              TravelPlanner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="relative text-slate-600 hover:text-slate-900 transition-colors duration-200 py-2 group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden hover:bg-slate-100 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className="relative w-5 h-5">
                    <Menu
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                        isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                      }`}
                    />
                    <X
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                        isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                      }`}
                    />
                  </div>
                </Button>

                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-slate-100 transition-colors duration-200"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                          {getInitials(session.user?.name || session.user?.email || "")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 bg-accent-foreground border-accent-foreground" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-slate-900">{session.user?.name || "User"}</p>
                        <p className="w-[200px] truncate text-sm text-slate-500">{session.user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  asChild 
                  variant="ghost" 
                  className=" hover:bg-slate-100 transition-colors duration-200"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className=" bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-slate-200/50 py-4 space-y-1">
            {session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-200 transform hover:translate-x-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-200 transform hover:translate-x-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 transform hover:translate-x-1"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
