import { apiClient } from './authApi'

type AlertResponse = { success: boolean | string }
export type Volunteer = { id: string; name: string; email: string; skills: string[]; latitude: number; longitude: number; availability: boolean; district: string; vehicle?: string; created_at?: string; updated_at?: string }
export type VolunteerResponse = { success: boolean; district: string; count: number; volunteers: Volunteer[] }

export const alertApi = {
  send: () => apiClient.post<AlertResponse>('/api/alert/send').then(response => response.data),
  getVolunteers: () => apiClient.get<VolunteerResponse>('/api/alert/volunteer').then(response => response.data),
}
