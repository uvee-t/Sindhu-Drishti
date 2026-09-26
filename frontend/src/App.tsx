import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import { ZonePage } from './pages/ZonePage'
import { LocationCheckPage, NearestZonePage } from './pages/LocationTools'
import { IntelligenceTable, PriorityVillagesPage, RelocationSitesPage } from './pages/DataPages'
import AuthPage from './pages/Auth'
import ProtectedRoute from './components/auth/ProtectedRoute'
import VolunteerList from './pages/VolunteerList'

const secure=(page:React.ReactNode)=><ProtectedRoute><AppShell>{page}</AppShell></ProtectedRoute>
export default function App(){return <Routes><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/dashboard" element={secure(<Dashboard/> )}/><Route path="/red-zones" element={secure(<ZonePage kind="red"/> )}/><Route path="/flood-zones" element={secure(<ZonePage kind="flood"/> )}/><Route path="/location-check" element={secure(<LocationCheckPage/> )}/><Route path="/priority-villages" element={secure(<PriorityVillagesPage/> )}/><Route path="/locations" element={secure(<IntelligenceTable type="locations"/> )}/><Route path="/volunteers" element={secure(<VolunteerList/> )}/><Route path="/relocation-sites" element={secure(<RelocationSitesPage/> )}/><Route path="/nearest-green-zone" element={secure(<NearestZonePage kind="green"/> )}/><Route path="/nearest-safe-zone" element={secure(<NearestZonePage kind="safe"/> )}/><Route path="*" element={<Navigate to="/login" replace/>}/></Routes>}
