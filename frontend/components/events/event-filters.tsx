"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { EVENT_TYPES, EventType } from "@/types/events"

interface EventFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  eventType: EventType | "all"
  onEventTypeChange: (value: EventType | "all") => void
}

export function EventFilters({
  search,
  onSearchChange,
  eventType,
  onEventTypeChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events..."
          className="pl-9"
          aria-label="Search events"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-1 -translate-y-1/2"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <XIcon />
          </Button>
        )}
      </div>

      <Select
        value={eventType}
        onValueChange={(value) => onEventTypeChange(value as EventType | "all")}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Event type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {EVENT_TYPES.map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
