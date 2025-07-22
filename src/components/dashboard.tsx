"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { TripCard } from "@/components/trip-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MapPin, Calendar, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { useState } from "react"
import { Navbar } from "@/components/navbar"

export function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [trips, setTrips] = useState<any[]>([])
  const [loadingTrips, setLoadingTrips] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [isPending, session, router])

  useEffect(() => {
    async function fetchTrips() {
      if (session?.user?.id) {
        setLoadingTrips(true)
        setError(null)
        try {
          // getTripsByUser is a server action, so we need to call it via an API route or refactor it for client use
          const res = await fetch("/api/trips")
          if (!res.ok) throw new Error("Failed to fetch trips")
          const data = await res.json()
          setTrips(data.trips)
        } catch (err: any) {
          setError(err.message || "Failed to fetch trips")
        } finally {
          setLoadingTrips(false)
        }
      }
    }
    fetchTrips()
  }, [session?.user?.id])

  // Compute status dynamically
  const tripsWithStatus = trips.map((trip) => {
    const now = new Date()
    const start = new Date(trip.startDate || trip.start_date)
    const end = new Date(trip.endDate || trip.end_date)
    let status = "planned"
    if (now > end) status = "completed"
    else if (now >= start && now <= end) status = "ongoing"
    return { ...trip, status }
  })

  const stats = {
    total: tripsWithStatus.length,
    planned: tripsWithStatus.filter((trip) => trip.status === "planned").length,
    ongoing: tripsWithStatus.filter((trip) => trip.status === "ongoing").length,
    completed: tripsWithStatus.filter((trip) => trip.status === "completed").length,
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-medium text-slate-900 mb-2">Welcome back, {session?.user?.name}</h1>
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
          <h2 className="text-2xl font-medium text-slate-900 mb-6">Your Trips</h2>

          {loadingTrips ? (
            <div className="text-center py-12 text-slate-500">Loading trips...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : tripsWithStatus.length === 0 ? (
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
              {tripsWithStatus.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
