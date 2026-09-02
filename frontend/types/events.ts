import { BaseFilters } from "@/types/api"

export type EventId = number

export const EVENT_TYPES = [
  "conference",
  "meetup",
  "workshop",
  "webinar",
  "other",
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export interface EventData {
  id: EventId
  name: string
  user_id: number
  event_type: EventType
  description: string
  start_time: string
  end_time: string
  payload: Record<string, unknown>
}

export interface EventPayload {
  name: string
  user: number
  event_type: EventType
  description: string
  start_time: string
  end_time: string
  payload: Record<string, unknown>
}

export type EventUpdatePayload = Partial<Omit<EventPayload, "user">>

export interface EventListFilters extends BaseFilters {
  event_type?: EventType
}

export interface EventAnalytics {
  total: number
  counts_by_type: Record<string, number>
}
