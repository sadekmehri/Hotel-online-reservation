export interface CountryModel {
  readonly countryId?: number
  name: string
}

export const CountryModel = Symbol('CountryModel')
