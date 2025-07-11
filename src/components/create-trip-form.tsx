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
import { Loader2, MapPin, Calendar, DollarSign, ChevronDown as ChevronDownIcon } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"

export function CreateTripForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [isPending, session, router])

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-slate-900 mb-2">Create New Trip</h1>
          <p className="text-slate-600">Start planning your next adventure</p>
        </div>
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-slate-900">Create New Trip</CardTitle>
            <CardDescription className="text-slate-600">Plan your next adventure by filling out the details below</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={() => {}} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700">Trip Title *</Label>
                <Input id="title" name="title" placeholder="e.g., Summer Vacation in Japan" required disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your trip..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center text-slate-700">
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  Destination *
                </Label>
                <Input id="destination" name="destination" placeholder="e.g., Tokyo, Japan" required disabled={isLoading} />
              </div>

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
                        {startDate ? startDate.toLocaleDateString() : "Pick a start date"}
                        <Calendar className="ml-auto h-4 w-4 text-blue-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setStartDate(date)
                          setStartOpen(false)
                        }}
                        disabled={isLoading}
                      />
                    </PopoverContent>
                  </Popover>
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
                        {endDate ? endDate.toLocaleDateString() : "Pick an end date"}
                        <Calendar className="ml-auto h-4 w-4 text-blue-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setEndDate(date)
                          setEndOpen(false)
                        }}
                        disabled={isLoading}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center text-slate-700">
                  <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                  Budget (Optional)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Trip
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
