import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/forms/event-form"

export default function CreateEventPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <header>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/events">
              <ChevronLeftIcon />
              Back to events
            </Link>
          }
        />
      </header>

      <EventForm />
    </div>
  )
}
