import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type CurrentUser } from '../services/authApi'

type Session = {
  user?: CurrentUser
  isLoading: boolean
  isAuthenticated: boolean
  refresh: () => Promise<unknown>
  clear: () => void
  message: string
}

const SessionContext = createContext<Session | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [invalidatedBy, setInvalidatedBy] = useState<unknown>()
  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.currentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
  useEffect(() => {
    const invalidate = (event: Event) => {
      setInvalidatedBy((event as CustomEvent).detail)
    }
    window.addEventListener('sindhu-auth-failure', invalidate)
    return () => window.removeEventListener('sindhu-auth-failure', invalidate)
  }, [queryClient])
  const clear = () => {
    setInvalidatedBy(new Error('Session ended'))
    queryClient.setQueryData(['current-user'], undefined)
  }
  const refresh = async () => {
    setInvalidatedBy(undefined)
    return query.refetch()
  }
  const failure = invalidatedBy ?? query.error
  return <SessionContext.Provider value={{ user: query.data, isLoading: query.isLoading && !invalidatedBy, isAuthenticated: Boolean(query.data) && !query.isError && !invalidatedBy, refresh, clear, message: authFailureMessage(failure) }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used inside SessionProvider')
  return context
}

export function authFailureMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { code?: string; errorCode?: string; error?: { code?: string } } | undefined
    const code = body?.code ?? body?.errorCode ?? body?.error?.code
    if (code === 'TOKEN_EXPIRED') return 'Your session has expired. Please sign in again.'
    if (code === 'INVALID_TOKEN') return 'Your session is no longer valid. Please sign in again.'
    if (code === 'AUTHENTICATION_REQUIRED') return 'Please sign in to access the dashboard.'
  }
  return 'Please sign in to continue.'
}
