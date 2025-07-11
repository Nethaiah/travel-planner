"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { TripCard } from "@/components/trip-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MapPin, Calendar, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [isPending, session, router])

  // Static placeholder trips array
  const trips = [
    {
      id: 1,
      title: "Sample Trip to Paris",
      description: "Experience the beauty of Paris with this amazing trip!",
      destination: "Paris, France",
      start_date: "2024-08-01",
      end_date: "2024-08-07",
      status: "planned",
      cover_image: "/simon-english-48nerZQCHgo-unsplash.jpg"
    },
    {
      id: 2,
      title: "Adventure in Tokyo",
      description: "Explore the vibrant city of Tokyo and its culture.",
      destination: "Tokyo, Japan",
      start_date: "2024-09-10",
      end_date: "2024-09-20",
      status: "ongoing",
      cover_image: "/simon-english-48nerZQCHgo-unsplash.jpg"
    },
    {
      id: 3,
      title: "Relaxing in Bali",
      description: "Enjoy the beaches and tranquility of Bali.",
      destination: "Bali, Indonesia",
      start_date: "2024-07-15",
      end_date: "2024-07-22",
      status: "completed",
      cover_image: "/simon-english-48nerZQCHgo-unsplash.jpg"
    }
  ]

  const stats = {
    total: trips.length,
    planned: trips.filter((trip) => trip.status === "planned").length,
    ongoing: trips.filter((trip) => trip.status === "ongoing").length,
    completed: trips.filter((trip) => trip.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-slate-900 mb-2">Welcome back, {session?.user?.name}</h1>
            <p className="text-slate-600">Here's an overview of your travel plans</p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Link href="/trip/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Planned</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-blue-600">{stats.planned}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-orange-600">{stats.ongoing}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-slate-900 mb-6">Your Trips</h2>

          {trips.length === 0 ? (
            <Card className="border-0 shadow-sm bg-white text-center py-12">
              <CardHeader>
                <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <CardTitle className="text-xl font-medium text-slate-900">No trips yet</CardTitle>
                <CardDescription className="text-slate-600">Start planning your first adventure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/trip/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Trip
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
