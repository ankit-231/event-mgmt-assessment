import { EventId, EventListFilters } from "@/types/events"

export const eventKeys = {
  all: () => ["events"] as const,

  lists: () => [...eventKeys.all(), "list"] as const,
  list: (filters: EventListFilters) => [...eventKeys.lists(), filters] as const,
  listInfinite: (filters: Omit<EventListFilters, "page">) =>
    [...eventKeys.lists(), "infinite", filters] as const,

  details: () => [...eventKeys.all(), "detail"] as const,
  detail: (id: EventId) => [...eventKeys.details(), id] as const,

  analytics: () => [...eventKeys.all(), "analytics"] as const,
}

export const configurationKeys = {
  all: () => ["configuration"] as const,
  detail: () => [...configurationKeys.all(), "detail"] as const,
}
