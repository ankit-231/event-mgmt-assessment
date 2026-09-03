import httpClient from "@/lib/http-client"
import { apiEndpoints } from "@/lib/api-endpoints"
import { ConfigurationData } from "@/types/configuration"

export const getConfiguration = async () => {
  const res = await httpClient.get<ConfigurationData>(
    apiEndpoints.configuration.detail
  )
  return res.data.data
}

export const seedEvents = async () => {
  const res = await httpClient.post<ConfigurationData>(apiEndpoints.seedEvents)
  return res.data.data
}
