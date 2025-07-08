"use client"

import { useEffect } from "react"
import { signOut, useSession } from "@/lib/auth-client"
import type React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

export default function Dashboard() {
    const router = useRouter()
    const { data: session, isPending } = useSession();

    useEffect(() => {
    if (!isPending && !session?.user) {
      console.log("No session found, redirecting to login")
      router.push("/login");
    } else {
        console.log("Session found, redirecting to dashboard")
        router.push("/dashboard");
    }
  }, [isPending, session, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to your dashboard</h1>
                <p className="text-slate-600 text-lg mb-6">Here you can manage your account and your travel plans</p>
                <Button variant="outline" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
