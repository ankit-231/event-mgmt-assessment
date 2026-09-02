export interface ApiResponse<T> {
  data: T
  message: string
}

export interface ApiErrorResponse<T = unknown> {
  message: string
  extra: T
}

export interface PaginatedData<T> {
  count: number // total number of objects available
  results_count: number // number of objects in this page
  next: string | null // URL of next page or null
  previous: string | null // URL of previous page or null
  total_pages: number
  current_page: number
  page_size: number
  filters: Record<string, unknown>
  results: T
}

// export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedData<T>> {}
// Above gives "An interface declaring no members is equivalent to its supertype" eslint error, so below is used instead.
export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>

export interface BaseFilters {
  page?: number
  page_size?: number
  ordering?: string
  q?: string
}
