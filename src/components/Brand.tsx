import { Link } from 'react-router-dom'

type BrandProps = {
  tenantName?: string
}

export function Brand({ tenantName }: BrandProps) {
  return (
    <Link aria-label="Sojurno home" className="inline-flex items-baseline gap-2" to="/">
      <span className="sj-display text-3xl italic leading-none">Sojurno</span>
      {tenantName ? (
        <span className="hidden text-sm font-semibold text-text-muted sm:inline">· {tenantName}</span>
      ) : null}
    </Link>
  )
}
