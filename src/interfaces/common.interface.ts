export interface Meta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface Pagination {
  page: number;
  limit: number;
  search?: string;
}
