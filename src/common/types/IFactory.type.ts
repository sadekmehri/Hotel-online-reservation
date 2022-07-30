export interface IFactory<T> {
  generate(limit: number): Promise<T[] | T>
  create(): Promise<T>
}

export const IFactory = Symbol('IFactory')
