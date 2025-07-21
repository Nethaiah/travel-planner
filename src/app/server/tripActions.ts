"use server"

import { LOCATION_IQ_API_KEY } from "@/lib/env"
import { AutocompleteParams, LocationIQResult } from "@/lib/types"
import prisma from "@/lib/prisma"
import { tripSchema, type TripFormData } from "@/lib/validations"

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

// Server action to create a trip with images
export async function createTrip(data: TripFormData & { userId: string }) {
  // Validate data
  const result = tripSchema.safeParse(data);
  if (!result.success) {
    console.error("Server validation failed:", result.error.flatten().fieldErrors);
    throw new Error(Object.values(result.error.flatten().fieldErrors).flat().join("; "));
  }

  const { images, startDate, endDate, ...tripData } = result.data;

  // Calculate itinerary days
  const itineraryDays = [];
  let currentDate = new Date(startDate);
  let dayNumber = 1;
  while (currentDate <= endDate) {
    itineraryDays.push({
      day_number: dayNumber,
      date: new Date(currentDate),
    });
    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber++;
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        ...tripData,
        startDate,
        endDate,
        userId: data.userId,
        coverImage: data.coverImage ?? null,
        lat: data.lat ?? 0,
        lon: data.lon ?? 0,
        description: tripData.description ?? "No description provided",
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
        itinerary_days: {
          create: itineraryDays,
        },
      },
      include: { 
        images: true,
        itinerary_days: true,
      },
    });
    return trip;
  } catch (error) {
    console.error("Database error creating trip:", error);
    throw new Error("Failed to create trip. Please try again.");
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
      throw new Error("Failed to fetch trip. Please try again.");
  }
}
