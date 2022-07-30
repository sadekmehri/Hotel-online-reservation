export interface IPaginateResponse<T> {
  data: T[]
  pagination: {
    total: number
    pageCount: number
    currentPage: number
    perPage: number
    from: number
    to: number
  }
}

export const IPaginateResponse = Symbol('IPaginateResponse')
