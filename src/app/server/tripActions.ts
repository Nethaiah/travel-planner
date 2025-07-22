"use server"

import { LOCATION_IQ_API_KEY } from "@/lib/env"
import { AutocompleteParams, LocationIQResult } from "@/lib/types"
import prisma from "@/lib/prisma"
import { tripSchema, type TripFormData } from "@/lib/validations"
import { activitySchema, type ActivityFormData } from "@/lib/validations"

export async function searchDestinations(params: AutocompleteParams): Promise<LocationIQResult[]> {
  try {
    const searchParams = new URLSearchParams({
      key: LOCATION_IQ_API_KEY || "",
      q: params.q,
      limit: params.limit?.toString() || "10",
      dedupe: "1"
    })

    if (params.countrycodes) {
      searchParams.append("countrycodes", params.countrycodes)
    }
    if (params.normalizecity !== undefined) {
      searchParams.append("normalizecity", params.normalizecity.toString())
    }
    if (params["accept-language"]) {
      searchParams.append("accept-language", params["accept-language"])
    }

    const response = await fetch(
      `https://api.locationiq.com/v1/autocomplete?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error("LocationIQ API error:", response.status, response.statusText)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching destinations from LocationIQ:", error)
    return []
  }
}

export async function getDestinationDetails(placeId: string): Promise<LocationIQResult | null> {
  try {
    const response = await fetch(
      `https://api.locationiq.com/v1/place?key=${LOCATION_IQ_API_KEY}&place_id=${placeId}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching destination details from LocationIQ:", error)
    return null
  }
}

// Helper function to calculate itinerary days
function calculateItineraryDays(startDate: Date, endDate: Date) {
  const itineraryDays = [];
  
  // Ensure we're working with Date objects and normalize to start of day
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(start);
  let dayNumber = 1;
  
  // Include both start and end dates
  while (currentDate <= end) {
    itineraryDays.push({
      day_number: dayNumber,
      date: new Date(currentDate),
      title: `Day ${dayNumber}`,
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber++;
  }
  
  return itineraryDays;
}

// Server action to create a trip with itinerary days in a single transaction
export async function createTrip(data: TripFormData & { userId: string }) {
  // Validate data
  const result = tripSchema.safeParse(data);
  if (!result.success) {
    console.error("Server validation failed:", result.error.flatten().fieldErrors);
    throw new Error(Object.values(result.error.flatten().fieldErrors).flat().join("; "));
  }

  const { images, startDate, endDate, ...tripData } = result.data;

  try {
    // Calculate itinerary days before creating the trip
    const itineraryDaysData = calculateItineraryDays(startDate, endDate);
    
    // Create trip and itinerary days in a single transaction
    const trip = await prisma.$transaction(async (tx) => {
      // Create the trip first
      const createdTrip = await tx.trip.create({
        data: {
          ...tripData,
          startDate,
          endDate,
          userId: data.userId,
          coverImage: data.coverImage ?? null,
          lat: data.lat ?? 0,
          lon: data.lon ?? 0,
          description: tripData.description?.trim() ? tripData.description : "No description provided",
          placeId: data.placeId ?? null,
          osmId: data.osmId ?? null,
          osmType: data.osmType ?? null,
          class: data.class ?? null,
          type: data.type ?? null,
          importance: data.importance ?? null,
          icon: data.icon ?? null,
          displayName: data.displayName ?? null,
          addressJson: data.addressJson ?? null,
          images: {
            create: (images || []).map((url, idx) => ({
              url,
              order: idx,
            })),
          },
        },
        include: { 
          images: true,
        },
      });

      // Create itinerary days
      await tx.itineraryDay.createMany({
        data: itineraryDaysData.map(day => ({
          ...day,
          tripId: createdTrip.id,
        })),
      });

      return createdTrip;
    });
    
    // Fetch the complete trip with itinerary days
    const tripWithItinerary = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        images: true,
        itinerary_days: {
          orderBy: {
            day_number: 'asc'
          },
          include: {
            activities: true
          }
        },
      },
    });
    
    return tripWithItinerary;
  } catch (error) {
    console.error("Database error creating trip:", error);
    throw new Error("Failed to create trip. Please try again.");
  }
}

// Separate function to create itinerary days (if needed elsewhere)
export async function createItineraryDays(tripId: string, startDate: Date, endDate: Date) {
  try {
    const itineraryDays = calculateItineraryDays(startDate, endDate);
    
    const createdDays = await prisma.itineraryDay.createMany({
      data: itineraryDays.map(day => ({
        ...day,
        tripId: tripId,
      })),
    });
    
    return createdDays;
  } catch (error) {
    console.error("Database error creating itinerary days:", error);
    throw new Error("Failed to create itinerary days. Please try again.");
  }
}

// Fetch all trips for a user (with images)
export async function getTripsByUser(userId: string) {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: { images: true },
      orderBy: { startDate: "asc" },
    });
    return trips;
  } catch (error) {
    console.error("Database error fetching trips:", error);
    throw new Error("Failed to fetch trips. Please try again.");
  }
}

// Fetch a single trip by id (with images and all LocationIQ fields)
export async function getTripById(tripId: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { 
        images: true,
        itinerary_days: {
          include: {
            activities: true
          },
          orderBy: {
            day_number: 'asc'
          }
        }
      },
    });
    
    return trip;
  } catch (error) {
    console.error("Database error fetching trip:", error);
    throw new Error("Failed to fetch trip. Please try again.");
  }
}

// Server action to create an activity for an itinerary day
export async function createActivity(data: ActivityFormData & { dayId: string }) {
  // Validate data
  const result = activitySchema.safeParse(data)
  if (!result.success) {
    console.error("Server validation failed:", result.error.flatten().fieldErrors)
    throw new Error(Object.values(result.error.flatten().fieldErrors).flat().join("; "))
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        dayId: data.dayId,
        title: data.title,
        description: data.description?.trim() ? data.description : "No description provided",
        location: data.location?.trim() ? data.location : "No location provided",
        startTime: data.startTime?.trim() ? data.startTime : "No start time provided",
        endTime: data.endTime?.trim() ? data.endTime : "No end time provided",
        cost: data.cost ?? 0,
        category: data.category ?? "activity",
      },
    })
    return activity
  } catch (error) {
    console.error("Database error creating activity:", error)
    throw new Error("Failed to create activity. Please try again.")
  }
}

// Server action to delete an activity by its id
export async function deleteActivity(activityId: string) {
  try {
    await prisma.activity.delete({
      where: { id: activityId },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error deleting activity:", error);
    throw new Error("Failed to delete activity. Please try again.");
  }
}

// Server action to delete a trip by its id
export async function deleteTrip(tripId: string) {
  try {
    await prisma.trip.delete({
      where: { id: tripId },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error deleting trip:", error);
    throw new Error("Failed to delete trip. Please try again.");
  }
}

