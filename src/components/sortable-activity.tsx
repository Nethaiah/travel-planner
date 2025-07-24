import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MapPin, Clock, DollarSign, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";

interface SortableActivityProps {
  activity: any;
  dayId: string;
  setDeleteDialog: (val: { activityId: string; dayId: string }) => void;
}

export function SortableActivity({ activity, dayId, setDeleteDialog }: SortableActivityProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f1f5f9' : undefined,
    cursor: 'grab',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-transparent hover:border-blue-300 group"
    >
      <div className="flex items-center mr-2">
        <button
          {...listeners}
          className="mr-3 text-slate-400 hover:text-blue-600 focus:outline-none cursor-grab"
          tabIndex={-1}
          aria-label="Drag to reorder"
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-slate-900">
            {activity.title}
          </h4>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {activity.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ activityId: activity.id, dayId: dayId })}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {activity.description && (
          <p className="text-sm text-slate-600 mt-1">
            {activity.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
          {activity.location && (
            <span className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" />
              {activity.location}
            </span>
          )}
          {activity.startTime && (
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {activity.startTime}
              {activity.endTime && ` - ${activity.endTime}`}
            </span>
          )}
          {activity.cost && activity.cost > 0 ? (
            <span className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" />
              ${activity.cost}
            </span>
          ) : (
            <span className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" />
              No cost provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 