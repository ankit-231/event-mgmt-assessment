import { EventId } from "@/types/events"

export const apiEndpoints = {
  events: {
    list: "/events/",
    create: "/events/",
    detail: (eventId: EventId) => `/events/${eventId}/`,
    update: (eventId: EventId) => `/events/${eventId}/`,
    delete: (eventId: EventId) => `/events/${eventId}/`,
    analytics: "/events/analytics/",
  },
  configuration: {
    detail: "/core/configuration/",
  },
  seedEvents: "/core/seed-events/",
} as const

export type ApiEndpoints = typeof apiEndpoints

export const APIBaseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
