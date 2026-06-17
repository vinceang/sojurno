import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { TenantProvider } from './tenants/TenantProvider'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { DesignPage } from './pages/DesignPage'
import { ExplorePage } from './pages/ExplorePage'
import { HostDashboardPage } from './pages/HostDashboardPage'
import { HostListingsPage } from './pages/HostListingsPage'
import { LandingPage } from './pages/LandingPage'
import { ListingPage } from './pages/ListingPage'
import { StartPage } from './pages/StartPage'

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<LandingPage />} index />
        <Route element={<CommunitiesPage />} path="communities" />
        <Route element={<StartPage />} path="start" />
        <Route element={<DesignPage />} path="design" />
        <Route element={<TenantProvider />} path="t/:tenantId">
          <Route element={<Navigate replace to="explore" />} index />
          <Route element={<ExplorePage />} path="explore" />
          <Route element={<ListingPage />} path="stays/:listingId" />
          <Route element={<HostDashboardPage />} path="host" />
          <Route element={<HostListingsPage />} path="host/listings" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}
