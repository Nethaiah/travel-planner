"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Clock, DollarSign } from "lucide-react"
import { useTravel } from "@/contexts/travel-context"
import { createActivitySchema } from "@/lib/validations"
import type { ActivityCategory } from "@/lib/types"

interface AddActivityFormProps {
  dayId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddActivityForm({ dayId, onSuccess, onCancel }: AddActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<ActivityCategory>("activity")
  const { actions } = useTravel()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      start_time: (formData.get("start_time") as string) || undefined,
      end_time: (formData.get("end_time") as string) || undefined,
      cost: formData.get("cost") ? Number(formData.get("cost")) : undefined,
      category,
    }

    try {
      const validatedData = createActivitySchema.parse(data)
      await actions.addActivity(dayId, validatedData)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Add New Activity</CardTitle>
        <CardDescription>Add an activity to your itinerary</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input id="title" name="title" placeholder="e.g., Visit Senso-ji Temple" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the activity..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </Label>
            <Input id="location" name="location" placeholder="e.g., Asakusa, Tokyo" disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ActivityCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Start Time
              </Label>
              <Input id="start_time" name="start_time" type="time" disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                End Time
              </Label>
              <Input id="end_time" name="end_time" type="time" disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost (Optional)
            </Label>
            <Input id="cost" name="cost" type="number" placeholder="0" min="0" step="0.01" disabled={isLoading} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Activity
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
