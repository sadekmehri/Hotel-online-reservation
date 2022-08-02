import { IPaginateResponse } from '../types'

export function paginate<T>(
  data: T[],
  currentPage: number,
  limit: number,
  pageCount: number,
): IPaginateResponse<T> {
  const { length } = data

  return {
    data,
    pagination: {
      total: length,
      pageCount,
      currentPage,
      perPage: limit,
      from: (currentPage - 1) * limit + 1,
      to: (currentPage - 1) * limit + length,
    },
  }
}
