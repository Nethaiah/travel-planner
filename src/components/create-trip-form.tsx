"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Calendar, DollarSign, ChevronDown as ChevronDownIcon, ImageIcon, UploadIcon, XIcon, AlertCircleIcon, Search, Globe, AlertCircle, Trash2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { toast } from "sonner"
import { UploadButton } from "@/lib/uploadthing"
import { searchDestinations } from "@/app/server/tripActions"
import { LocationIQResult } from "@/lib/types"
import { useForm } from "react-hook-form"
import { tripSchema, type TripFormData } from "@/lib/validations"
import { createTrip } from "@/app/server/tripActions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Navbar } from "@/components/navbar"
import { before } from "node:test"

export function CreateTripForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [coverImage, setCoverImage] = useState<string>("")
  const [destinationSearch, setDestinationSearch] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<LocationIQResult | null>(null)
  const [searchResults, setSearchResults] = useState<LocationIQResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [destinationError, setDestinationError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // UploadThing image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // useForm setup - Fixed the register naming conflict
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors }, watch } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      description: "",
      destination: "",
      startDate: new Date(),
      endDate: new Date(),
      budget: 0,
      images: [],
      lat: 0,
      lon: 0,
      placeId: "",
      osmId: "",
      osmType: "",
      class: "",
      type: "",
      importance: undefined,
      icon: "",
      displayName: "",
      addressJson: {},
    },
  })

  // Watch for form changes
  const watchedImages = watch("images")

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [isPending, session, router])

  // Sync imageUrls with form state
  useEffect(() => {
    setValue("images", imageUrls);
    // Trigger validation for images field
    if (imageUrls.length > 0) {
      setValue("images", imageUrls, { shouldValidate: true });
    }
    
    if (imageUrls.length > 0 && !coverImage) {
      setCoverImage(imageUrls[0]);
      setValue("coverImage", imageUrls[0], { shouldValidate: true });
    }
    if (coverImage && imageUrls.includes(coverImage)) {
      setValue("coverImage", coverImage, { shouldValidate: true });
    }
  }, [imageUrls, coverImage, setValue]);


  // Reset cover image if it's no longer in the array
  useEffect(() => {
    if (coverImage && !imageUrls.includes(coverImage)) {
      const newCover = imageUrls[0] || ""
      setCoverImage(newCover)
      setValue("coverImage", newCover)
    }
  }, [imageUrls, coverImage, setValue])

  // Debounced search for destinations
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (destinationSearch.length >= 2) {
        setIsSearching(true)
        try {
          const results = await searchDestinations({
            q: destinationSearch,
            limit: 8,
            normalizecity: 1
          })
          setSearchResults(results)
          if (results.length === 0) {
            setDestinationError("No matching destination found.")
          } else {
            setDestinationError(null)
          }
        } catch (error) {
          console.error("Error searching destinations:", error)
          setSearchResults([])
          setDestinationError("Failed to fetch destination suggestions.")
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setDestinationError(null)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimeout)
  }, [destinationSearch])

  // Function to remove image
  const removeImage = (urlToRemove: string) => {
    setImageUrls(prev => {
      const newUrls = prev.filter(url => url !== urlToRemove);
      
      // Trigger validation for the updated image array
      setValue("images", newUrls, { shouldValidate: true });
      
      // If the cover image is removed, set the cover to the first remaining image or empty
      if (coverImage === urlToRemove) {
        const newCover = newUrls[0] || "";
        setCoverImage(newCover);
        setValue("coverImage", newCover, { shouldValidate: true });
      }
      return newUrls;
    });
  };

  // Autocomplete select
  const handleDestinationSelect = (selectedDest: LocationIQResult) => {
    setValue("destination", selectedDest.display_name)
    setValue("lat", parseFloat(selectedDest.lat))
    setValue("lon", parseFloat(selectedDest.lon))
    setValue("placeId", selectedDest.place_id || "")
    setValue("osmId", selectedDest.osm_id || "")
    setValue("osmType", selectedDest.osm_type || "")
    setValue("class", selectedDest.class || "")
    setValue("type", selectedDest.type || "")
    setValue("importance", selectedDest.importance)
    setValue("icon", selectedDest.icon || "")
    setValue("displayName", selectedDest.display_name || "")
    setValue("addressJson", selectedDest.address || {})
    
    setSelectedDestination(selectedDest)
    setDestinationSearch("")
    setShowAutocomplete(false)
    setDestinationError(null)
  }

  // Autocomplete input change
  const handleDestinationInputChange = (value: string) => {
    setValue("destination", value, { shouldValidate: true })
    setDestinationSearch(value)
    setShowAutocomplete(value.length > 0)
    setDestinationError(null)
    if (!value) {
      setSelectedDestination(null)
      // Reset location fields
      setValue("lat", 0)
      setValue("lon", 0)
      setValue("placeId", "")
      setValue("osmId", "")
      setValue("osmType", "")
      setValue("class", "")
      setValue("type", "")
      setValue("importance", undefined)
      setValue("icon", "")
      setValue("displayName", "")
      setValue("addressJson", {})
    }
  }

  // Date pickers integration
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("startDate", date, { shouldValidate: true });
      // Ensure end date is after start date
      const currentEndDate = getValues("endDate");
      if (currentEndDate && currentEndDate <= date) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setValue("endDate", newEndDate, { shouldValidate: true });
      }
      // Trigger validation for both fields
      setTimeout(() => {
        setValue("startDate", date, { shouldValidate: true });
        setValue("endDate", getValues("endDate"), { shouldValidate: true });
      }, 0);
    }
    setStartOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("endDate", date, { shouldValidate: true });
      // Trigger validation to check if end date is after start date
      setTimeout(() => {
        setValue("endDate", date, { shouldValidate: true });
      }, 0);
    }
    setEndOpen(false);
  };

  // Form submit
  async function onSubmit(data: TripFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const formData: TripFormData = {
        ...data,
        description: data.description?.trim() || undefined,
        lat: selectedDestination ? parseFloat(selectedDestination.lat) : 0,
        lon: selectedDestination ? parseFloat(selectedDestination.lon) : 0,
        images: imageUrls,
        coverImage: coverImage,
        placeId: selectedDestination?.place_id || "",
        osmId: selectedDestination?.osm_id || "",
        osmType: selectedDestination?.osm_type || "",
        class: selectedDestination?.class || "",
        type: selectedDestination?.type || "",
        importance: selectedDestination?.importance,
        icon: selectedDestination?.icon || "",
        displayName: selectedDestination?.display_name || "",
        addressJson: selectedDestination?.address || {},
      };

      // Validate the form data
      const result = tripSchema.safeParse(formData);
      if (!result.success) {
        console.error("Validation errors:", result.error.flatten().fieldErrors);
        setIsLoading(false);
        return;
      }

      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a trip.");
      }

      console.log("Submitting form data:", formData);
      await createTrip({ ...formData, userId: session.user.id });
      
      toast.success("Trip created successfully! 🎉", {
        duration: 3000,
        position: "bottom-right",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating trip:", error);
      setError(error?.message || "Failed to create trip. Please try again.");
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-slate-900 mb-2">Create New Trip</h1>
          <p className="text-slate-600">Start planning your next adventure</p>
        </div>
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-slate-900">Create New Trip</CardTitle>
            <CardDescription className="text-slate-600">Plan your next adventure by filling out the details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700">Trip Title *</Label>
                <Input 
                  id="title" 
                  {...register("title")} 
                  placeholder="e.g., Summer Vacation in Japan" 
                  disabled={isLoading} 
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Tell us about your trip..."
                  rows={3}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center text-slate-700">
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  Destination *
                </Label>
                <div className="relative">
                  <Input
                    id="destination"
                    {...register("destination")}
                    placeholder="e.g., Tokyo, Japan"
                    disabled={isLoading}
                    onChange={e => handleDestinationInputChange(e.target.value)}
                    onFocus={() => setShowAutocomplete(!!getValues("destination"))}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {/* Autocomplete dropdown */}
                  {showAutocomplete && (searchResults.length > 0 || isSearching) && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Searching destinations...
                        </div>
                      ) : (
                        searchResults.map((result, index) => (
                          <button
                            key={`${result.place_id}-${index}`}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                            onClick={() => handleDestinationSelect(result)}
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="font-medium">{result.display_place}</span>
                            </div>
                            <div className="text-sm text-gray-500 ml-6">{result.display_address}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {errors.destination && <p className="text-sm text-red-600 mt-1">{errors.destination.message}</p>}
                {destinationError && <p className="text-sm text-red-600 mt-1">{destinationError}</p>}
              </div>

              {/* Geocoding Information Display */}
              {selectedDestination && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    {selectedDestination.icon && (
                      <img src={selectedDestination.icon} alt="Place icon" className="h-6 w-6 mr-2" />
                    )}
                    <Globe className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Location Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Country:</span>
                      <p className="text-blue-800">{selectedDestination.address.country || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">City:</span>
                      <p className="text-blue-800">{selectedDestination.address.city || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">State/Region:</span>
                      <p className="text-blue-800">{selectedDestination.address.state || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Coordinates:</span>
                      <p className="text-blue-800">
                        {parseFloat(selectedDestination.lat).toFixed(4)}, {parseFloat(selectedDestination.lon).toFixed(4)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-blue-700 font-medium">Full Address:</span>
                      <p className="text-blue-800">{selectedDestination.display_name}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Place Type:</span>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedDestination.class && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">{selectedDestination.class}</span>
                        )}
                        {selectedDestination.type && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">{selectedDestination.type}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Importance:</span>
                      <p className="text-blue-800">
                        {selectedDestination.importance !== undefined ? selectedDestination.importance.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="flex items-center text-slate-700">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    Start Date *
                  </Label>
                  <Popover open={startOpen} onOpenChange={setStartOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={isLoading}
                      >
                        {getValues("startDate") ? getValues("startDate")?.toLocaleDateString() : "Pick a start date"}
                        <Calendar className="ml-auto h-4 w-4 text-blue-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={getValues("startDate") ?? undefined}
                        captionLayout="dropdown"
                        onSelect={handleStartDateChange}
                        disabled={isLoading}
                        hidden = {{ before: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d })() }}
                        defaultMonth={getValues("startDate") ?? new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date" className="flex items-center text-slate-700">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    End Date *
                  </Label>
                  <Popover open={endOpen} onOpenChange={setEndOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={isLoading}
                      >
                        {getValues("endDate") ? getValues("endDate")?.toLocaleDateString() : "Pick an end date"}
                        <Calendar className="ml-auto h-4 w-4 text-blue-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={getValues("endDate") ?? undefined}
                        captionLayout="dropdown"
                        onSelect={handleEndDateChange}
                        disabled={isLoading}
                        hidden={{ before: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d })() }}
                        defaultMonth={getValues("endDate") ?? new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center text-slate-700">
                  <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                  Budget (Optional)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("budget", { valueAsNumber: true })}
                  placeholder="1000"
                  disabled={isLoading}
                />
                {errors.budget && <p className="text-sm text-red-600">{errors.budget.message}</p>}
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-slate-700 flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4 text-blue-500" />
                  Trip Photos *
                  <span className="text-sm text-slate-500 ml-2">(At least 1 photo required)</span>
                </Label>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={res => {
                        const newUrls = res.map(f => f.url || f.ufsUrl).filter(Boolean);
                        setImageUrls(prev => {
                          const updatedUrls = [...prev, ...newUrls];
                          // Trigger validation immediately
                          setValue("images", updatedUrls, { shouldValidate: true });
                          return updatedUrls;
                        });
                      }}
                      onUploadError={error => {
                        console.error("Upload error:", error)
                      }}
                      appearance={{
                        button: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors disabled:opacity-50",
                        container: "w-full flex justify-center",
                        allowedContent: "text-slate-600 text-sm"
                      }}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Display uploaded images */}
                  {imageUrls.length > 0 && (
                    <div className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageUrls.map((url, idx) => (
                          <div key={url} className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            coverImage === url ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
                          }`}>
                            <img src={url} alt={`Trip photo ${idx + 1}`} className="w-full h-32 object-cover" />
                            
                            {/* Cover image indicator */}
                            {coverImage === url && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">
                                Cover
                              </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow transition-colors"
                                disabled={isLoading}
                                title="Remove photo"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            
                            {/* Set as cover button */}
                            <button
                              type="button"
                              onClick={() => {
                                setCoverImage(url)
                                setValue("coverImage", url)
                              }}
                              className="absolute bottom-2 left-2 bg-white/90 hover:bg-white text-xs px-2 py-1 rounded shadow transition-colors"
                              disabled={isLoading}
                            >
                              Set as cover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Image validation error */}
                {errors.images && ( <p className="text-sm text-red-600">{errors.images.message} </p> )}
                
              </div>

              {/* Cover Image Selection Info */}
              {imageUrls.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ImageIcon className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">Cover Photo Selected</h3>
                  </div>
                  <p className="text-sm text-green-800">
                    {coverImage ? "Your cover photo has been set. This will be the main image displayed for your trip." : "Click 'Set as cover' on any photo to make it your trip's main image."}
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 flex justify-center">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-colors disabled:opacity-50" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Trip
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}