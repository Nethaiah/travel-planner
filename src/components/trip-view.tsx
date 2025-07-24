"use client"

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Edit, Plus, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddActivityForm } from "@/components/create-activity-form";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableActivity } from "./sortable-activity";

interface TripPageProps {
  trip: any;
}

export type { TripPageProps };

export function TripPage({ trip: initialTrip }: TripPageProps) {
  const [trip, setTrip] = useState(initialTrip);
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ activityId: string; dayId: string } | null>(null);
  const router = useRouter();
  const { data: session, isPending } = useSession()

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Derive activitiesByDay from trip state - single source of truth
  const activitiesByDay = useMemo(() => {
    if (!trip?.itinerary_days) return {};
    const map: Record<string, any[]> = {};
    trip.itinerary_days.forEach((day: any) => {
      map[day.id] = day.activities ? [...day.activities] : [];
    });
    return map;
  }, [trip]);
  
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [isPending, session, router])

  // Update local trip state when prop changes
  useEffect(() => {
    setTrip(initialTrip);
  }, [initialTrip]);

  // Function to add a new activity to the local state
  const handleActivityAdded = (newActivity: any, dayId: string) => {
    setTrip((prevTrip: any) => {
      if (!prevTrip) return prevTrip;
      return {
        ...prevTrip,
        itinerary_days: prevTrip.itinerary_days?.map((day: any) => 
          day.id === dayId 
            ? { ...day, activities: [...(day.activities || []), newActivity] }
            : day
        ) || []
      };
    });
  };

  // Function to remove an activity from the local state
  const handleActivityDeleted = (activityId: string, dayId: string) => {
    setTrip((prevTrip: any) => {
      if (!prevTrip) return prevTrip;
      return {
        ...prevTrip,
        itinerary_days: prevTrip.itinerary_days?.map((day: any) => 
          day.id === dayId 
            ? { ...day, activities: day.activities?.filter((activity: any) => activity.id !== activityId) || [] }
            : day
        ) || []
      };
    });
  };

  // Function to update activity order after drag and drop
  const handleActivityReorder = (dayId: string, newActivities: any[]) => {
    setTrip((prevTrip: any) => {
      if (!prevTrip) return prevTrip;
      return {
        ...prevTrip,
        itinerary_days: prevTrip.itinerary_days?.map((day: any) => 
          day.id === dayId 
            ? { ...day, activities: newActivities }
            : day
        ) || []
      };
    });
  };

  const handleDeleteActivity = async (activityId: string, dayId: string) => {
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete activity");
      toast.success("Activity deleted");
      handleActivityDeleted(activityId, dayId);
      setDeleteDialog(null);
    } catch (err) {
      toast.error("Failed to delete activity");
      console.error(err);
    }
  };

  if (!trip) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-16">
          <div className="container mx-auto py-8 px-4">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-slate-900 mb-4">Trip not found</h1>
              <p className="text-slate-600 mb-4">The trip you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto py-8 px-4">
          {/* Trip Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h1 className="text-3xl font-medium text-slate-900 mb-2">{trip.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")} ({duration} days)
                  </div>
                  <Badge className={getStatusColor(trip.status || 'planned')}>
                    {trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1) : 'Planned'}
                  </Badge>
                </div>
              </div>
            </div>
            {trip.description && (
              <p className="text-slate-600 mb-4">{trip.description}</p>
            )}
            {trip.budget && trip.budget > 0 ? (
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="mr-1 h-4 w-4" />
                Budget: ${trip.budget.toLocaleString()}
              </div>
            ) : (
              <div className="flex items-center text-sm text-slate-400 italic">
                <DollarSign className="mr-1 h-4 w-4" />
                No budget set
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
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-900">Trip Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium text-slate-900">{duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge className={getStatusColor(trip.status || 'planned')}>
                          {trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1) : 'Planned'}
                        </Badge>
                      </div>
                      {trip.budget && trip.budget > 0 ? (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Budget:</span>
                          <span className="font-medium text-slate-900">${trip.budget.toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-slate-400 italic">
                          <span className="text-slate-600">Budget:</span>
                          <span>No budget set</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-900">Activities Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Activities:</span>
                        <span className="font-medium text-slate-900">
                          {trip.itinerary_days?.reduce((total: number, day: any) => total + (day.activities?.length || 0), 0) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Days Planned:</span>
                        <span className="font-medium text-slate-900">{trip.itinerary_days?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-900">Destination Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-600">Location:</span>
                        <p className="font-medium text-slate-900">{trip.destination}</p>
                      </div>
                      {trip.displayName && (
                        <div>
                          <span className="text-slate-600">Full Address:</span>
                          <p className="font-medium text-sm text-slate-900">{trip.displayName}</p>
                        </div>
                      )}
                      {trip.lat && trip.lon && (
                        <div>
                          <span className="text-slate-600">Coordinates:</span>
                          <p className="font-medium text-sm text-slate-900">
                            {trip.lat.toFixed(4)}, {trip.lon.toFixed(4)}
                          </p>
                        </div>
                      )}
                      {(trip.class || trip.type) && (
                        <div>
                          <span className="text-slate-600">Place Type:</span>
                          <div className="flex items-center gap-2 mt-1">
                            {trip.class && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">
                                {trip.class}
                              </span>
                            )}
                            {trip.type && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">
                                {trip.type}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {trip.importance && (
                        <div>
                          <span className="text-slate-600">Importance:</span>
                          <p className="font-medium text-sm text-slate-900">{trip.importance.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="mt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-slate-900">Daily Itinerary</h2>
                <p className="text-slate-600 mt-1">Plan your activities for each day</p>
              </div>
              {trip.itinerary_days && trip.itinerary_days.length > 0 ? (
                <div className="space-y-6">
                  {trip.itinerary_days.map((day: any) => (
                    <Card key={day.id} className="bg-white border-0 shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center font-medium text-slate-900">
                              <span>{`Day ${day.day_number}`}</span>
                            </CardTitle>
                            <CardDescription className="mt-1 text-slate-600">
                              {format(new Date(day.date), "EEEE, MMM d")}
                            </CardDescription>
                          </div>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                            onClick={() => setShowAddActivity(showAddActivity === day.id ? null : day.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Activity
                          </Button>
                        </div>
                      </CardHeader>
                      {showAddActivity === day.id && (
                        <CardContent className="border-t">
                          <div className="pt-4">
                            <AddActivityForm
                              dayId={day.id}
                              onSuccess={(newActivity) => {
                                handleActivityAdded(newActivity, day.id);
                                setShowAddActivity(null);
                              }}
                              onCancel={() => setShowAddActivity(null)}
                            />
                          </div>
                        </CardContent>
                      )}
                      {activitiesByDay[day.id] && activitiesByDay[day.id].length > 0 && (
                        <CardContent className={showAddActivity === day.id ? "border-t" : ""}>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                              if (active.id !== over?.id) {
                                const oldIndex = activitiesByDay[day.id].findIndex((a) => a.id === active.id);
                                const newIndex = activitiesByDay[day.id].findIndex((a) => a.id === over?.id);
                                const newActivities = arrayMove(activitiesByDay[day.id], oldIndex, newIndex);
                                handleActivityReorder(day.id, newActivities);
                              }
                            }}
                          >
                            <SortableContext
                              items={activitiesByDay[day.id].map((a) => a.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-3">
                                {activitiesByDay[day.id].map((activity: any) => (
                                  <SortableActivity 
                                    key={activity.id} 
                                    activity={activity} 
                                    dayId={day.id} 
                                    setDeleteDialog={setDeleteDialog} 
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </CardContent>
                      )}
                      {(!activitiesByDay[day.id] || activitiesByDay[day.id].length === 0) && showAddActivity !== day.id && (
                        <CardContent>
                          <div className="text-center py-8 text-slate-500">
                            <Calendar className="mx-auto h-8 w-8 mb-2" />
                            <p className="text-sm">No activities planned for this day</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white border-0 shadow-sm text-center py-12">
                  <CardHeader>
                    <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <CardTitle className="text-xl font-medium text-slate-900">No itinerary created yet</CardTitle>
                    <CardDescription className="text-slate-600">Your trip days will appear here once the trip is created</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="mt-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-slate-900">Trip Map</CardTitle>
                  <CardDescription className="text-slate-600">View your destination and activity locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-96 bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-slate-600 mb-4">
                        Map will display your destination and activity locations
                      </p>
                      <div className="text-left max-w-md mx-auto space-y-2 text-sm text-slate-600">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Main destination: {trip.destination}
                        </div>
                        {trip.lat && trip.lon && (
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Coordinates: {trip.lat.toFixed(4)}, {trip.lon.toFixed(4)}
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
      </div>
      {/* Global AlertDialog for deleting activity */}
      {deleteDialog && (
        <AlertDialog open={!!deleteDialog} onOpenChange={open => { if (!open) setDeleteDialog(null); }}>
          <AlertDialogContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-6 text-slate-900">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-lg font-semibold text-slate-900">Delete Activity</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 text-sm">
                Are you sure you want to delete this activity? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-end gap-2 mt-4">
              <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-700 border border-slate-200 rounded-md px-4 py-2 font-medium">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (deleteDialog) await handleDeleteActivity(deleteDialog.activityId, deleteDialog.dayId);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 font-medium">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}