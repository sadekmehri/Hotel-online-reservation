export interface IPersist<T> {
  insert(limit: number): Promise<void>
  select(limit: number): Promise<Partial<T>[]>
}

export const IPersist = Symbol('IPersist')
