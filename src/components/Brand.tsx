import { Link } from 'react-router-dom'
import { Wordmark } from './Wordmark'

type BrandProps = {
  tenantName?: string
}

export function Brand({ tenantName }: BrandProps) {
  return (
    <Link aria-label="Sojurno home" className="inline-flex items-center gap-2.5 text-foreground" to="/">
      <Wordmark className="h-[1.6rem] w-auto" />
      {tenantName ? (
        <span className="hidden text-sm font-semibold text-text-muted sm:inline">· {tenantName}</span>
      ) : null}
    </Link>
  )
}
