import { useEffect, useMemo } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { TenantContext, type TenantContextValue } from './tenant-context'
import { getActiveTenant } from './tenants'
import type { ActiveTenantId } from '../types'

export function TenantProvider() {
  const { tenantId } = useParams()
  const tenant = getActiveTenant(tenantId)

  useEffect(() => {
    if (tenant?.id) {
      document.documentElement.dataset.tenant = tenant.id
    }
  }, [tenant])

  const value = useMemo<TenantContextValue | undefined>(() => {
    if (!tenant) {
      return undefined
    }
    return {
      tenant,
      tenantId: tenant.id as ActiveTenantId,
    }
  }, [tenant])

  if (!tenant || !value) {
    return <Navigate to="/communities" replace />
  }

  return (
    <TenantContext.Provider value={value}>
      <Outlet />
    </TenantContext.Provider>
  )
}
