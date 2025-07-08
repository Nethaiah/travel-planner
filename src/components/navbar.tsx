"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, LogIn, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession, signOut } from "@/lib/auth-client"
import type React from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent backdrop-blur-sm'} border-b border-white/10`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">    
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <MapPin className="h-6 w-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-2xl text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">TravelPlanner</span>
          </Link>

          {session?.user ? (
            <>
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || "/placeholder.svg"} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session?.user?.name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trips">My Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="text-white/90 text-lg hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/login" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r text-lg from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
                  >
                    <Link href="/register" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="flex flex-col space-y-3 mt-4">
              <div className="pt-2 space-y-2">
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full justify-center text-white border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <Link href="/login" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <Link href="/register" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}
