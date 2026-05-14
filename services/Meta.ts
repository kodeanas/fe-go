export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  page?: number
  limit?: number
  total_items?: number
  total_pages: number
}
