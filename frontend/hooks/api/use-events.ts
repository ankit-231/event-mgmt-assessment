import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { eventKeys } from "@/lib/query-keys"
import {
  createEvent,
  deleteEvent,
  getEventAnalytics,
  getEventDetail,
  getEventList,
  updateEvent,
} from "@/lib/api/events.api"
import {
  EventId,
  EventListFilters,
  EventPayload,
  EventUpdatePayload,
} from "@/types/events"

export function useEventList(
  filters: EventListFilters = {},
  options: { refetchInterval?: number | false } = {}
) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => getEventList(filters),
    retry: false,
    refetchInterval: options.refetchInterval ?? false,
    // keep the previous page's data on screen while a poll/filter change refetches
    placeholderData: (previousData) => previousData,
  })
}

export function useEventListInfinite(
  filters: Omit<EventListFilters, "page"> = {}
) {
  return useInfiniteQuery({
    queryKey: eventKeys.listInfinite(filters),
    queryFn: ({ pageParam = 1 }) =>
      getEventList({ ...filters, page: pageParam }),
    getNextPageParam: (data) =>
      data.current_page < data.total_pages ? data.current_page + 1 : undefined,
    getPreviousPageParam: (data) =>
      data.current_page > 1 ? data.current_page - 1 : undefined,
    initialPageParam: 1,
    retry: false,
  })
}

export function useEventDetail(id: EventId | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? -1),
    queryFn: () => getEventDetail(id as EventId),
    retry: false,
    enabled: !!id,
  })
}

export function useEventAnalytics(
  options: { refetchInterval?: number | false } = {}
) {
  return useQuery({
    queryKey: eventKeys.analytics(),
    queryFn: getEventAnalytics,
    retry: false,
    refetchInterval: options.refetchInterval ?? false,
  })
}

export function useEventCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: EventPayload) => createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: eventKeys.analytics() })
    },
  })
}

export function useEventUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: EventId
      payload: EventUpdatePayload
    }) => updateEvent(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: eventKeys.analytics() })
    },
  })
}

export function useEventDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: EventId }) => deleteEvent(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: eventKeys.analytics() })
    },
  })
}
