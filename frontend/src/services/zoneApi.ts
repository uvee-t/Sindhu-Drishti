import type { Coordinates } from '../types/gis'
import type { PriorityTier } from '../types/gis'
import { apiClient } from './authApi'

const data = <T>(path: string, params?: Record<string, string | number>) => apiClient.get<T>(`/api/zone/${path}`, { params }).then(r => r.data)
export const zoneApi = {
  getRedZones: () => data('redzones'),
  checkLocation: (latitude: number, longitude: number) => data('check-location', { lat: latitude, lon: longitude }),
  getNearestGreenZone: (latitude: number, longitude: number) => data('nearest-green-zone', { lat: latitude, lon: longitude }),
  getPriorityVillages: (tier: PriorityTier) => data('priority-villages', { tier }),
  getLocations: () => data('locations'),
  getRelocationSites: () => data('relocation-sites'),
  getNearestSafeZone: (latitude: number, longitude: number) => data('nearest-safe-zone', { lat: latitude, lon: longitude }),
  getFloodZones: () => data('flood-zones'),
}
export const coordinateFrom = (value: unknown): Coordinates | undefined => {
  if (Array.isArray(value) && value.length >= 2 && Number.isFinite(+value[0]) && Number.isFinite(+value[1])) return { lon: +value[0], lat: +value[1] }
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    const lat = Number(v.lat), lon = Number(v.lon ?? v.lng)
    if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon }
    if (Array.isArray(v.coordinates)) return coordinateFrom(v.coordinates)
  }
}
