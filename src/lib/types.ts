export interface LocationIQResult {
  place_id: string
  osm_id: string
  osm_type: string
  licence: string
  lat: string
  lon: string
  boundingbox?: string[]
  class: string
  type: string
  importance?: number
  icon?: string
  display_name: string
  display_place?: string
  display_address?: string
  address: {
    name?: string
    house_number?: string
    road?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
    [key: string]: any
  }
}

export interface AutocompleteParams {
  q: string
  limit?: number
  countrycodes?: string
  normalizecity?: 0 | 1
  "accept-language"?: string
}