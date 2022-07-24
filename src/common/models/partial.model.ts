export type Partial<T> = {
  [k in keyof T]?: T[k]
}
