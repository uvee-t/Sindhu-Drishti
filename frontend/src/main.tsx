import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SessionProvider } from './contexts/SessionContext'
import { LanguageProvider } from './contexts/LanguageContext'
import './styles.css'
import './session.css'
import './sidebar.css'
import './alert.css'
import './toast.css'
import './volunteers.css'
import 'leaflet/dist/leaflet.css'

const client = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={client}><SessionProvider><LanguageProvider><BrowserRouter><App /></BrowserRouter></LanguageProvider></SessionProvider></QueryClientProvider></React.StrictMode>)
