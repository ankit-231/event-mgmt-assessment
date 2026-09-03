import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { configurationKeys, eventKeys } from "@/lib/query-keys"
import { getConfiguration, seedEvents } from "@/lib/api/configuration.api"

export function useConfiguration() {
  return useQuery({
    queryKey: configurationKeys.detail(),
    queryFn: getConfiguration,
    retry: false,
  })
}

export function useSeedEvents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: seedEvents,
    onSuccess: (data) => {
      queryClient.setQueryData(configurationKeys.detail(), data)
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: eventKeys.analytics() })
    },
  })
}
