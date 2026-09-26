import axios from 'axios'

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', timeout: 12000, withCredentials: true })

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sindhu-auth-failure', { detail: error }))
    }
    return Promise.reject(error)
  },
)

export type LoginPayload = { email: string; distCode: string; password: string }
export type RegisterPayload = LoginPayload & { fullname: string }
type AuthResponse = { success: boolean; message: string | Record<string, unknown> }
export type CurrentUser = { name: string; distCode: string | number; distName: string; email: string }

export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<AuthResponse>('/auth/login', payload).then(response => response.data),
  register: (payload: RegisterPayload) => apiClient.post<AuthResponse>('/auth/register', payload).then(response => response.data),
  currentUser: () => apiClient.get<CurrentUser>('/api/user/').then(response => response.data),
  logout: () => apiClient.post(import.meta.env.VITE_LOGOUT_PATH || '/auth/logout'),
}

export const authErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string') return message
  }
  return 'Unable to reach the service. Please try again.'
}
