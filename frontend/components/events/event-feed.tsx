"use client"

import { InboxIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventList } from "@/hooks/api/use-events"
import { EVENT_FEED_POLL_INTERVAL_MS } from "@/lib/constants"
import { EventListFilters } from "@/types/events"

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

interface EventFeedProps {
  filters: EventListFilters
}

export function EventFeed({ filters }: EventFeedProps) {
  const { data, isPending, isError, isFetching } = useEventList(filters, {
    refetchInterval: EVENT_FEED_POLL_INTERVAL_MS,
  })

  const events = data?.results ?? []

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Activity feed</CardTitle>
        <span
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className={`size-1.5 rounded-full ${isFetching ? "animate-pulse bg-primary" : "bg-muted-foreground/40"}`}
          />
          {isFetching ? "Updating..." : "Live"}
        </span>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {isPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Couldn&apos;t load the activity feed.
          </p>
        )}

        {!isPending && !isError && events.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
            <InboxIcon className="size-6" />
            <p className="text-sm">No events match your filters.</p>
          </div>
        )}

        <ul className="flex flex-col gap-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-1.5 rounded-xl border border-border/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {event.event_type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {timeFormatter.format(new Date(event.start_time))}
                </span>
              </div>

              {event.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}

              {event.payload && Object.keys(event.payload).length > 0 && (
                <pre className="overflow-x-auto rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                  {JSON.stringify(event.payload)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
