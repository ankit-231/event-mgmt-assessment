import Link from "next/link"

import { Button } from "@/components/ui/button"
import { EventDashboard } from "@/components/events/event-dashboard"
import { SeedEventsButton } from "@/components/events/seed-events-button"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Event activity</h1>
          <p className="text-sm text-muted-foreground">
            Live feed of incoming events, updated every 5 seconds.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SeedEventsButton />
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/events">Manage events</Link>}
          />
        </div>
      </header>

      <EventDashboard />
    </div>
  )
}
