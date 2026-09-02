"use client"

import { useMemo, useState } from "react"

import { EventAnalyticsCard } from "@/components/events/event-analytics-card"
import { EventFilters } from "@/components/events/event-filters"
import { EventFeed } from "@/components/events/event-feed"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants"
import { EventListFilters, EventType } from "@/types/events"

export function EventDashboard() {
  const [search, setSearch] = useState("")
  const [eventType, setEventType] = useState<EventType | "all">("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const filters = useMemo<EventListFilters>(
    () => ({
      ...(debouncedSearch && { q: debouncedSearch }),
      ...(eventType !== "all" && { event_type: eventType }),
      // start_date/end_date are plain "YYYY-MM-DD" values from <input type="date">;
      // widen to the full day since Event.start_time is a datetime
      ...(startDate && {
        start_date: new Date(`${startDate}T00:00:00`).toISOString(),
      }),
      ...(endDate && {
        end_date: new Date(`${endDate}T23:59:59.999`).toISOString(),
      }),
    }),
    [debouncedSearch, eventType, startDate, endDate]
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
      <div className="flex flex-col gap-4 lg:order-1">
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          eventType={eventType}
          onEventTypeChange={setEventType}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />
        <EventFeed filters={filters} />
      </div>

      <div className="lg:sticky lg:top-4">
        <EventAnalyticsCard />
      </div>
    </div>
  )
}
