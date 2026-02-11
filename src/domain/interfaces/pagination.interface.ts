/**
 * Shared pagination and filtering interfaces used by repository interfaces.
 * Use these in domain interfaces instead of framework-specific types.
 */
export interface IPagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IFilters {
  [key: string]: string | number | boolean | undefined;
}
