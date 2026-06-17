import { createContext } from 'react'
import type { ActiveTenantId, Tenant } from '../types'

export type TenantContextValue = {
  tenant: Tenant
  tenantId: ActiveTenantId
}

export const TenantContext = createContext<TenantContextValue | undefined>(undefined)
