import type { Geometry, Feature, FeatureCollection } from 'geojson'

export type GeoFeature = Feature<Geometry, Record<string, unknown>>
export type GeoCollection = FeatureCollection<Geometry, Record<string, unknown>>
export type ZoneLayer = 'redZones' | 'floodZones' | 'villages' | 'locations' | 'sites' | 'selected' | 'routes'
export type PriorityTier = 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'MONITOR'
export type Coordinates = { lat: number; lon: number }
export type ApiRecord = Record<string, unknown>
export type ZoneResult = ApiRecord & { nearest_point?: unknown; distance_km?: number; zone_area_sqkm?: number; area_sqkm?: number }
