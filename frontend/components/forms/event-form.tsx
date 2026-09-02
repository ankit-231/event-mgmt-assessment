"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormInput } from "@/components/form-fields/form-input"
import { FormSelect } from "@/components/form-fields/form-select"
import { FormTextarea } from "@/components/form-fields/form-textarea"
import { FormDateTimePicker } from "@/components/form-fields/form-date-time-picker"
import { setFormErrors } from "@/lib/utils"
import { useEventCreate } from "@/hooks/api/use-events"
import { EVENT_TYPES, EventPayload } from "@/types/events"

const eventFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    // TODO: replace with the logged-in user's id once auth is wired up
    user: z
      .string()
      .min(1, "User id is required")
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) > 0,
        "User id must be a positive number"
      ),
    event_type: z.enum(EVENT_TYPES, {
      message: "Event type is required",
    }),
    description: z.string().min(1, "Description is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    payload: z.string().refine((value) => {
      try {
        return typeof JSON.parse(value) === "object"
      } catch {
        return false
      }
    }, "Payload must be valid JSON"),
  })
  .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
    message: "Start time must be before end time",
    path: ["start_time"],
  })

type EventFormValues = z.infer<typeof eventFormSchema>

export function EventForm() {
  const router = useRouter()
  const [rootError, setRootError] = useState<string>()

  const createEventMutation = useEventCreate()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      user: "",
      event_type: "other",
      description: "",
      start_time: "",
      end_time: "",
      payload: "{}",
    },
  })

  function onSubmit(values: EventFormValues) {
    setRootError(undefined)

    const payload: EventPayload = {
      name: values.name,
      user: Number(values.user),
      event_type: values.event_type,
      description: values.description,
      start_time: new Date(values.start_time).toISOString(),
      end_time: new Date(values.end_time).toISOString(),
      payload: JSON.parse(values.payload),
    }

    createEventMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/events")
      },
      onError: (error) => {
        const message = setFormErrors<EventFormValues>(
          form.setError,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.extra?.fields
        )
        setRootError(
          message ??
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.response?.data?.message ??
            "Something went wrong"
        )
      },
    })
  }

  const isSubmitting = createEventMutation.isPending

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create event</CardTitle>
        <CardDescription>Add a new event to the activity feed.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <FormInput<EventFormValues>
                name="name"
                label="Name"
                placeholder="Event name"
                control={form.control}
                disabled={isSubmitting}
              />
            </div>

            <FormSelect<EventFormValues>
              name="event_type"
              label="Event type"
              control={form.control}
              disabled={isSubmitting}
              options={EVENT_TYPES.map((type) => ({
                label: type,
                value: type,
              }))}
            />

            <FormInput<EventFormValues>
              name="user"
              label="User ID"
              placeholder="1"
              type="number"
              control={form.control}
              disabled={isSubmitting}
            />

            <FormDateTimePicker<EventFormValues>
              name="start_time"
              label="Start time"
              control={form.control}
              disabled={isSubmitting}
            />

            <FormDateTimePicker<EventFormValues>
              name="end_time"
              label="End time"
              control={form.control}
              disabled={isSubmitting}
            />

            <div className="sm:col-span-2">
              <FormTextarea<EventFormValues>
                name="description"
                label="Description"
                placeholder="What's this event about?"
                control={form.control}
                disabled={isSubmitting}
              />
            </div>

            <div className="sm:col-span-2">
              <FormTextarea<EventFormValues>
                name="payload"
                label="Payload (JSON)"
                placeholder="{}"
                control={form.control}
                disabled={isSubmitting}
              />
            </div>

            {rootError && (
              <p className="text-sm text-destructive sm:col-span-2">
                {rootError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="sm:col-span-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create event"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
