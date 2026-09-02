import httpClient from "@/lib/http-client"
import { apiEndpoints } from "@/lib/api-endpoints"
import { PaginatedData } from "@/types/api"
import {
  EventAnalytics,
  EventData,
  EventId,
  EventListFilters,
  EventPayload,
  EventUpdatePayload,
} from "@/types/events"

export const getEventList = async (filters: EventListFilters = {}) => {
  const res = await httpClient.get<PaginatedData<EventData[]>>(
    apiEndpoints.events.list,
    {
      params: {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        ...filters,
      },
    }
  )
  return res.data.data
}

export const getEventDetail = async (id: EventId) => {
  const res = await httpClient.get<EventData>(apiEndpoints.events.detail(id))
  return res.data.data
}

export const createEvent = async (payload: EventPayload) => {
  const res = await httpClient.post<EventData>(
    apiEndpoints.events.create,
    payload
  )
  return res.data.data
}

export const updateEvent = async (
  id: EventId,
  payload: EventUpdatePayload
) => {
  const res = await httpClient.patch<EventData>(
    apiEndpoints.events.update(id),
    payload
  )
  return res.data.data
}

export const deleteEvent = async (id: EventId) => {
  const res = await httpClient.delete<null>(apiEndpoints.events.delete(id))
  return res.data.data
}

export const getEventAnalytics = async () => {
  const res = await httpClient.get<EventAnalytics>(
    apiEndpoints.events.analytics
  )
  return res.data.data
}
