export interface IPersist<T> {
  insert(limit: number): Promise<T[]>
  select(limit: number): Promise<any[]>
}

export const IPersist = Symbol('IPersist')
