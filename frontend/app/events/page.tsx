import Link from "next/link"

import { Button } from "@/components/ui/button"
import { EventTable } from "@/components/events/event-table"

export default function EventsPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground">
            All events, paginated from the server.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/events/create">New event</Link>}
        />
      </header>

      <EventTable />
    </div>
  )
}
