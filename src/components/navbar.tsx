"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, LogIn, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                asChild 
                variant="ghost" 
                className="text-white/90 text-lg hover:bg-white/10 hover:text-white"
              >
                <Link href="/auth/sign-in" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r text-lg from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
              >
                <Link href="/auth/sign-up" className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>

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
        </div>

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
                  <Link href="/auth/sign-in" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <Link href="/auth/sign-up" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
