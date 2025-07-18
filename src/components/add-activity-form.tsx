"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { activitySchema, type ActivityFormData } from "@/lib/validations"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Clock, DollarSign } from "lucide-react"

interface AddActivityFormProps {
  dayId: string
  onSuccess?: () => void
  onCancel?: () => void
  onSubmitActivity?: (data: ActivityFormData) => Promise<void>
}

export function AddActivityForm({ dayId, onSuccess, onCancel, onSubmitActivity }: AddActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      cost: undefined,
      category: "activity",
    },
  })

  async function onSubmit(data: ActivityFormData) {
    setIsLoading(true)
    setError(null)
    try {
      if (onSubmitActivity) {
        await onSubmitActivity(data)
      }
      reset()
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || "An error occurred")
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input id="title" {...register("title")} placeholder="e.g., Visit Senso-ji Temple" required disabled={isLoading} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the activity..."
              rows={2}
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </Label>
            <Input id="location" {...register("location")} placeholder="e.g., Asakusa, Tokyo" disabled={isLoading} />
            {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={undefined} onValueChange={val => setValue("category", val as ActivityFormData["category"]) } defaultValue="activity" disabled={isLoading}>
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
            {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Start Time
              </Label>
              <Input id="startTime" type="time" {...register("startTime")} disabled={isLoading} />
              {errors.startTime && <p className="text-sm text-red-600">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                End Time
              </Label>
              <Input id="endTime" type="time" {...register("endTime")} disabled={isLoading} />
              {errors.endTime && <p className="text-sm text-red-600">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost (Optional)
            </Label>
            <Input id="cost" type="number" step="0.01" min="0" {...register("cost", { valueAsNumber: true })} placeholder="0" disabled={isLoading} />
            {errors.cost && <p className="text-sm text-red-600">{errors.cost.message}</p>}
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
