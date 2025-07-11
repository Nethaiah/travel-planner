"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useState } from "react"

export function TripCard({ trip }: { trip: any }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const startDate = new Date(trip.start_date)
  const endDate = new Date(trip.end_date)
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "ongoing":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const handleDelete = async () => {
    // if (confirm("Are you sure you want to delete this trip?")) {
    //   setIsDeleting(true)
    //   try {
    //     await actions.deleteTrip(trip.id)
    //   } catch (error) {
    //     console.error("Failed to delete trip:", error)
    //   } finally {
    //     setIsDeleting(false)
    //   }
    // }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      <div className="relative h-48 w-full bg-slate-100">
        {trip.cover_image ? (
          <Image src={trip.cover_image} alt={trip.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-slate-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/trips/${trip.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Trip
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 flex items-center" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Trip"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium text-slate-900 line-clamp-1">{trip.title}</CardTitle>
          <Badge variant="outline" className={getStatusColor(trip.status)}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
        {trip.description && <p className="text-sm text-slate-600 line-clamp-2 mt-1">{trip.description}</p>}
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="line-clamp-1">{trip.destination}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")} ({duration} days)
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href={`/trips/${trip.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
