import { Calendar, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import type { ActiveTenantId } from '../types'

const dateOptions = ['Any dates', 'Jul 18–21', 'Aug 9–12', 'Oct 12–14']

type SearchPanelProps = {
  defaultTenant?: ActiveTenantId
  compact?: boolean
}

export function SearchPanel({ compact = false, defaultTenant = 'runners' }: SearchPanelProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tenantId, setTenantId] = useState<ActiveTenantId>(defaultTenant)
  const [dateOpen, setDateOpen] = useState(false)
  const [dateLabel, setDateLabel] = useState(t('landing.anyDates'))

  const tenantOptions = useMemo(() => ACTIVE_TENANTS.map((tenant) => ({ id: tenant.id, name: tenant.name })), [])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (dateLabel !== t('landing.anyDates')) params.set('dates', dateLabel)
    navigate(`/t/${tenantId}/explore${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      className={
        compact
          ? 'flex flex-wrap items-center gap-2'
          : 'flex max-w-2xl flex-col items-stretch overflow-visible rounded-xl bg-card shadow-lg sm:flex-row sm:items-center'
      }
      onSubmit={submitSearch}
    >
      <label
        className={
          compact
            ? 'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm'
            : 'flex flex-1 items-center gap-3 border-b border-border px-5 py-3.5 sm:border-b-0 sm:border-r'
        }
      >
        <Search aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-text-muted" />
        <span className="sr-only">{t('landing.search')}</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-muted"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={compact ? t('explore.anyLocation') : t('landing.search')}
          type="search"
          value={query}
        />
      </label>
      <label
        className={
          compact
            ? 'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm'
            : 'flex items-center gap-3 border-b border-border px-5 py-3.5 sm:border-b-0 sm:border-r'
        }
      >
        <span className="sr-only">{t('nav.community')}</span>
        <select
          className="bg-transparent text-sm font-semibold outline-none"
          onChange={(event) => setTenantId(event.target.value as ActiveTenantId)}
          value={tenantId}
        >
          {tenantOptions.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
      </label>
      <div className="relative">
        <button
          className={
            compact
              ? 'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm hover:bg-muted/60'
              : 'flex min-h-[3.25rem] w-full items-center gap-3 px-5 py-3.5 text-sm text-text-muted hover:bg-muted/60 sm:w-auto'
          }
          onClick={() => setDateOpen((open) => !open)}
          type="button"
        >
          <Calendar aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          <span>{dateLabel}</span>
        </button>
        {dateOpen ? (
          <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg">
            {dateOptions.map((option) => {
              const label = option === 'Any dates' ? t('landing.anyDates') : option
              return (
                <button
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted/60"
                  key={option}
                  onClick={() => {
                    setDateLabel(label)
                    setDateOpen(false)
                  }}
                  type="button"
                >
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
      <button
        className={
          compact
            ? 'min-h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90'
            : 'bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90'
        }
        type="submit"
      >
        {t('landing.searchButton')}
      </button>
    </form>
  )
}
