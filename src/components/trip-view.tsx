"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Edit, Plus, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTripById } from "@/app/server/tripActions"
import { AddActivityForm } from "@/components/add-activity-form"
import { Navbar } from "@/components/navbar"

interface TripPageProps {
  params: { id: string }
}

export type { TripPageProps }

export function TripPage({ params }: TripPageProps) {
  const tripId = params.id
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTrip() {
      setLoading(true)
      try {
        const tripData = await getTripById(tripId)
        setTrip(tripData)
      } catch (e) {
        setTrip(null)
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [tripId])

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading trip...</div>
  }

  if (!trip) {
    return <div className="container mx-auto py-8 px-4">Trip not found.</div>
  }

  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      // await actions.deleteActivity(activityId) // This line was removed as per the new_code
    }
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Trip Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {trip.destination}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")} ({duration} days)
              </div>
              <Badge className={getStatusColor(trip.status)}>
                {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
              </Badge>
            </div>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link href={`/trips/${trip.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Link>
          </Button>
        </div>

        {trip.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{trip.description}</p>
        )}

        {trip.budget && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <DollarSign className="mr-1 h-4 w-4" />
            Budget: ${trip.budget.toLocaleString()}
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                    </Badge>
                  </div>
                  {trip.budget && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">${trip.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Destination Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trip.icon && (
                    <img src={trip.icon} alt="Place icon" className="h-6 w-6 mb-2" />
                  )}
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{trip.destination}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Full Address:</span>
                    <p className="font-medium text-sm">{trip.displayName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <p className="font-medium text-sm">{trip.addressJson?.country || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">City:</span>
                    <p className="font-medium text-sm">{trip.addressJson?.city || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">State/Region:</span>
                    <p className="font-medium text-sm">{trip.addressJson?.state || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coordinates:</span>
                    <p className="font-medium text-sm">
                      {trip.lat?.toFixed(4)}, {trip.lon?.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Place Type:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {trip.class && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">{trip.class}</span>
                      )}
                      {trip.type && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">{trip.type}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Importance:</span>
                    <p className="font-medium text-sm">
                      {trip.importance !== undefined ? trip.importance.toFixed(2) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activities Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Activities:</span>
                    <span className="font-medium">
                      {trip.itinerary_days?.reduce((total: number, day: any) => total + day.activities.length, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Planned:</span>
                    <span className="font-medium">{trip.itinerary_days?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary" className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Itinerary</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Plan your activities for each day</p>
          </div>

          {trip.itinerary_days && trip.itinerary_days.length > 0 ? (
            <div className="space-y-6">
              {trip.itinerary_days.map((day: any) => (
                <Card key={day.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <span>{day.title || `Day ${day.day_number}`}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">{format(new Date(day.date), "EEEE, MMM d")}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddActivity(showAddActivity === day.id ? null : day.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                      </Button>
                    </div>
                    {day.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{day.notes}</p>}
                  </CardHeader>

                  {showAddActivity === day.id && (
                    <CardContent className="border-t">
                      <div className="pt-4">
                        { <AddActivityForm
                          dayId={day.id}
                          onSuccess={() => setShowAddActivity(null)}
                          onCancel={() => setShowAddActivity(null)}
                        />}
                      </div>
                    </CardContent>
                  )}

                  {day.activities && day.activities.length > 0 && (
                    <CardContent className={showAddActivity === day.id ? "border-t" : ""}>
                      <div className="space-y-3">
                        {day.activities.map((activity: any) => (
                          <div
                            key={activity.id}
                            className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {activity.category}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteActivity(activity.id)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {activity.location && (
                                  <span className="flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {activity.location}
                                  </span>
                                )}
                                {activity.latitude && activity.longitude && (
                                  <span className="flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {activity.latitude.toFixed(4)}, {activity.longitude.toFixed(4)}
                                  </span>
                                )}
                                {activity.start_time && (
                                  <span className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {activity.start_time}
                                    {activity.end_time && ` - ${activity.end_time}`}
                                  </span>
                                )}
                                {activity.cost && (
                                  <span className="flex items-center">
                                    <DollarSign className="mr-1 h-3 w-3" />${activity.cost}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}

                  {(!day.activities || day.activities.length === 0) && showAddActivity !== day.id && (
                    <CardContent>
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Calendar className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No activities planned for this day</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardHeader>
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <CardTitle>No itinerary created yet</CardTitle>
                <CardDescription>Your trip days will appear here once the trip is created</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Trip Map</CardTitle>
              <CardDescription>View your destination and activity locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Google Maps Integration</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Interactive map will be displayed here showing:
                  </p>
                  <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Main destination: {trip.destination}
                    </div>
                    {trip.lat && trip.lon && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Coordinates: {trip.lat.toFixed(4)},{" "}
                        {trip.lon.toFixed(4)}
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Activity locations with coordinates
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}
