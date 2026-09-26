import type { Feature, Geometry } from 'geojson'
import type { ApiRecord, GeoCollection, GeoFeature } from '../types/gis'

const isGeometry = (x: unknown): x is Geometry => !!x && typeof x === 'object' && 'type' in x && typeof (x as {type: unknown}).type === 'string'
const asRecord = (x: unknown): ApiRecord => x && typeof x === 'object' ? x as ApiRecord : {}
export function collectionFrom(value: unknown): GeoCollection {
  const v = asRecord(value)
  if (v.type === 'FeatureCollection' && Array.isArray(v.features)) return v as unknown as GeoCollection
  const list = Array.isArray(value) ? value : Array.isArray(v.data) ? v.data : Array.isArray(v.results) ? v.results : []
  return { type: 'FeatureCollection', features: list.flatMap((item): GeoFeature[] => {
    const r = asRecord(item)
    if (r.type === 'Feature' && isGeometry(r.geometry)) return [r as unknown as GeoFeature]
    const point = Array.isArray(r.coordinates) && r.coordinates.length >= 2 ? {type:'Point' as const,coordinates:[Number(r.coordinates[0]),Number(r.coordinates[1])]} : Number.isFinite(Number(r.latitude ?? r.lat)) && Number.isFinite(Number(r.longitude ?? r.lon ?? r.lng)) ? {type:'Point' as const,coordinates:[Number(r.longitude ?? r.lon ?? r.lng),Number(r.latitude ?? r.lat)]} : undefined
    const geometry = isGeometry(r.geometry) ? r.geometry : isGeometry(item) ? item : point
    return geometry ? [{ type: 'Feature', geometry, properties: r }] : []
  }) }
}
export function recordsFrom(value: unknown): ApiRecord[] {
  const v = asRecord(value)
  const rows = Array.isArray(value) ? value : Array.isArray(v.villages) ? v.villages : Array.isArray(v.sites) ? v.sites : Array.isArray(v.data) ? v.data : Array.isArray(v.results) ? v.results : undefined
  return rows ? rows.map(asRecord) : collectionFrom(value).features.map(f => ({...f.properties, geometry:f.geometry}))
}
export const displayName = (p: ApiRecord, fallback: string) => String(p.village_name ?? p.site_id ?? p.name ?? p.id ?? fallback)
export const prettyKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
export const prettyValue = (value: unknown) => value === null || value === undefined ? '—' : typeof value === 'number' ? value.toLocaleString(undefined, {maximumFractionDigits: 5}) : typeof value === 'object' ? JSON.stringify(value) : String(value)
export const priorityColor = (tier: unknown) => ({IMMEDIATE:'#c84242', SHORT_TERM:'#d47735', MEDIUM_TERM:'#b88715', MONITOR:'#26855a'}[String(tier).toUpperCase()] ?? '#516070')
