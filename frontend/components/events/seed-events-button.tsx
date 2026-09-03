"use client"

import { useState } from "react"
import { DatabaseIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useConfiguration, useSeedEvents } from "@/hooks/api/use-configuration"

export function SeedEventsButton() {
  const [open, setOpen] = useState(false)
  const { data: configuration } = useConfiguration()
  const { mutate: seed, isPending } = useSeedEvents()

  const lastSeededAt = configuration?.events_seeded_at ?? null
  const hasBeenSeeded = lastSeededAt !== null

  const lastSeededLabel = hasBeenSeeded
    ? new Date(lastSeededAt).toLocaleString()
    : "None"

  const handleConfirm = () => {
    seed(undefined, { onSuccess: () => setOpen(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="outline">
            <DatabaseIcon />
            Seed Events: Last Seeded {lastSeededLabel}
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasBeenSeeded ? "Re-seed events?" : "Seed events?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasBeenSeeded
              ? `Events were already seeded on ${lastSeededLabel}. Seeding again will add another batch of sample events on top of your existing data.`
              : "This will populate the database with a batch of sample events."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={hasBeenSeeded ? "destructive" : "default"}
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending
              ? "Seeding..."
              : hasBeenSeeded
                ? "Seed anyway"
                : "Seed events"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
