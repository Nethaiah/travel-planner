"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { format, isValid } from "date-fns"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TripCardProps {
  trip: any;
  onTripDeleted?: (tripId: string) => void;
}

export type { TripCardProps };

export function TripCard({ trip, onTripDeleted }: TripCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const startDate = new Date(trip.startDate || trip.start_date)
  const endDate = new Date(trip.endDate || trip.end_date)
  const duration = isValid(startDate) && isValid(endDate)
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : null

  const startDateStr = isValid(startDate) ? format(startDate, "MMM d") : "Invalid date"
  const endDateStr = isValid(endDate) ? format(endDate, "MMM d, yyyy") : "Invalid date"

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

  const handleDeleteTrip = async (tripId: string) => {
    setIsDeleting(true)
    try { 
      const res = await fetch(`/api/trips/${tripId}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) throw new Error("Failed to delete trip");
      toast.success("Trip deleted");
      setShowDeleteDialog(false);
      
      // Call the callback to update the parent component's state
      if (onTripDeleted) {
        onTripDeleted(tripId);
      } else {
        // Last Resort when no fallback provided
        window.location.reload()
      }
    } catch (err) {
      toast.error("Failed to delete trip");
      console.error(err);
    } finally {
      setIsDeleting(false)
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
        <div className="relative h-48 w-full bg-slate-100">
          {(trip.cover_image || trip.coverImage) ? (
            <Image src={trip.cover_image || trip.coverImage} alt={trip.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority className="object-cover" />
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
              <DropdownMenuContent align="end" className="border-0">
                <DropdownMenuItem asChild>
                  <Link href={`/trips/${trip.id}/edit`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Trip
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 flex items-center" 
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Trip
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
                {startDateStr} - {endDateStr}{duration ? ` (${duration} days)` : ""}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href={`/trip/${trip.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog - Moved outside the card */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-6 text-slate-900">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-lg font-semibold text-slate-900">Delete Trip</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 text-sm">
              Are you sure you want to delete this trip? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <AlertDialogCancel 
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-700 border border-slate-200 rounded-md px-4 py-2 font-medium"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-2 font-medium disabled:opacity-50"
              onClick={async () => {
                await handleDeleteTrip(trip.id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}