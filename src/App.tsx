import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { TenantProvider } from './tenants/TenantProvider'
import { AboutPage } from './pages/AboutPage'
import { BecomeHostPage } from './pages/BecomeHostPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { DesignPage } from './pages/DesignPage'
import { ExplorePage } from './pages/ExplorePage'
import { HostDashboardPage } from './pages/HostDashboardPage'
import { HostListingsPage } from './pages/HostListingsPage'
import { LandingPage } from './pages/LandingPage'
import { LegalPage } from './pages/LegalPage'
import { ListingPage } from './pages/ListingPage'
import { LoginPage } from './pages/LoginPage'
import { StartPage } from './pages/StartPage'

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<LandingPage />} index />
        <Route element={<CommunitiesPage />} path="communities" />
        <Route element={<StartPage />} path="start" />
        <Route element={<AboutPage />} path="about" />
        <Route element={<DesignPage />} path="design" />
        <Route element={<BecomeHostPage />} path="become-a-host" />
        <Route element={<LoginPage />} path="login" />
        <Route element={<LegalPage />} path="legal/:docId" />
        <Route element={<TenantProvider />} path="t/:tenantId">
          <Route element={<Navigate replace to="explore" />} index />
          <Route element={<ExplorePage />} path="explore" />
          <Route element={<CollectionDetailPage />} path="collections/:collectionId" />
          <Route element={<ListingPage />} path="stays/:listingId" />
          <Route element={<HostDashboardPage />} path="host" />
          <Route element={<HostListingsPage />} path="host/listings" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}
