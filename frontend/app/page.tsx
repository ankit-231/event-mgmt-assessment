import { EventDashboard } from "@/components/events/event-dashboard"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-lg font-semibold">Event activity</h1>
        <p className="text-sm text-muted-foreground">
          Live feed of incoming events, updated every 5 seconds.
        </p>
      </header>

      <EventDashboard />
    </div>
  )
}
