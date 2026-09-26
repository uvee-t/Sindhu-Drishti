import { useMutation, useQuery } from '@tanstack/react-query'
import { zoneApi } from '../services/zoneApi'
import type { PriorityTier } from '../types/gis'

export const useRedZones = () => useQuery({ queryKey: ['red-zones'], queryFn: zoneApi.getRedZones })
export const useFloodZones = () => useQuery({ queryKey: ['flood-zones'], queryFn: zoneApi.getFloodZones })
export const usePriorityVillages = (tier: PriorityTier = 'IMMEDIATE') => useQuery({ queryKey: ['priority-villages', tier], queryFn: () => zoneApi.getPriorityVillages(tier) })
export const useLocations = () => useQuery({ queryKey: ['locations'], queryFn: zoneApi.getLocations })
export const useRelocationSites = () => useQuery({ queryKey: ['relocation-sites'], queryFn: zoneApi.getRelocationSites })
export const useCheckLocation = () => useMutation({ mutationFn: ({lat, lon}:{lat:number;lon:number}) => zoneApi.checkLocation(lat, lon) })
export const useNearestGreenZone = () => useMutation({ mutationFn: ({lat, lon}:{lat:number;lon:number}) => zoneApi.getNearestGreenZone(lat, lon) })
export const useNearestSafeZone = () => useMutation({ mutationFn: ({lat, lon}:{lat:number;lon:number}) => zoneApi.getNearestSafeZone(lat, lon) })
