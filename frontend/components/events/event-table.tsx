"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventList } from "@/hooks/api/use-events"

const PAGE_SIZE = 10

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function EventTable() {
  const [page, setPage] = useState(1)

  const { data, isPending, isError, isFetching } = useEventList({
    page,
    page_size: PAGE_SIZE,
  })

  const events = data?.results ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {isError && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-destructive">
                  Couldn&apos;t load events.
                </TableCell>
              </TableRow>
            )}

            {!isPending && !isError && events.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No events yet.
                </TableCell>
              </TableRow>
            )}

            {!isPending &&
              !isError &&
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.event_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dateFormatter.format(new Date(event.start_time))}
                  </TableCell>
                  <TableCell>
                    {dateFormatter.format(new Date(event.end_time))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {data
            ? `Page ${data.current_page} of ${Math.max(data.total_pages, 1)} · ${data.count} events`
            : isFetching
              ? "Loading..."
              : null}
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!data || page >= data.total_pages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
