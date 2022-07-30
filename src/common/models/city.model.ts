export interface CityModel {
  readonly cityId?: number
  name: string
  countryId: number
}

export const CityModel = Symbol('CityModel')
