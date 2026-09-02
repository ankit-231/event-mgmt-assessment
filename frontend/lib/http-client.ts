import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios"
import { ApiResponse } from "@/types/api"
import { APIBaseURL } from "@/lib/api-endpoints"

interface CustomRequestConfig extends AxiosRequestConfig {
  publicRequest?: boolean
}

class HttpClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })

    this._setInterceptors()
  }

  private _setInterceptors() {
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          // no auth flow wired up yet - hook a redirect to /login here once one exists
          console.error("Unauthorized")
        }

        return Promise.reject(error)
      }
    )
  }

  private async request<T>(
    method: Method,
    url: string,
    data?: any,
    config: CustomRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const response = await this.client.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    })

    return response
  }

  public get<T = any>(url: string, config?: CustomRequestConfig) {
    return this.request<T>("GET", url, undefined, config)
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ) {
    return this.request<T>("POST", url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return this.request<T>("PUT", url, data, config)
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ) {
    return this.request<T>("PATCH", url, data, config)
  }

  public delete<T = any>(url: string, config?: CustomRequestConfig) {
    return this.request<T>("DELETE", url, undefined, config)
  }
}

const httpClient = new HttpClient(APIBaseURL)

export default httpClient
