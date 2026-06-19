import { Calendar, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { ACTIVE_TENANTS } from '../tenants/tenants'
import type { ActiveTenantId } from '../types'

const dateOptions = ['Any dates', 'Jul 18-21', 'Aug 9-12', 'Oct 12-14']

type SearchPanelProps = {
  defaultTenant?: ActiveTenantId
  /** Inline pill row (header / Explore). */
  compact?: boolean
  /** Always-vertical card (the mobile form-factor) — used in the two-column hero. */
  stacked?: boolean
  showTenantSelect?: boolean
}

export function SearchPanel({
  compact = false,
  defaultTenant = 'runners',
  showTenantSelect = compact,
  stacked = false,
}: SearchPanelProps) {
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

  const mode = compact ? 'compact' : stacked ? 'stacked' : 'bar'
  const cx = (forCompact: string, forStacked: string, forBar: string) =>
    mode === 'compact' ? forCompact : mode === 'stacked' ? forStacked : forBar

  return (
    <form
      className={cx(
        'flex flex-wrap items-center gap-2',
        'flex w-full flex-col items-stretch overflow-visible rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-lg)]',
        'flex w-full max-w-4xl flex-col items-stretch overflow-visible rounded-[var(--radius-xl)] bg-card shadow-[var(--shadow-lg)] sm:flex-row sm:items-center',
      )}
      onSubmit={submitSearch}
    >
      <label
        className={cx(
          'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm',
          'flex min-h-14 items-center gap-3 border-b border-border px-5 py-3.5',
          'flex min-h-16 flex-1 items-center gap-4 border-b border-border px-6 py-4 sm:border-b-0 sm:border-r md:px-8',
        )}
      >
        <Search aria-hidden="true" className={cx('h-4 w-4 flex-shrink-0 text-text-muted', 'h-5 w-5 flex-shrink-0 text-text-muted', 'h-6 w-6 flex-shrink-0 text-text-muted')} />
        <span className="sr-only">{t('landing.search')}</span>
        <input
          className={cx(
            'min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-muted',
            'min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-text-muted',
            'min-w-0 flex-1 bg-transparent text-xl text-foreground outline-none placeholder:text-text-muted',
          )}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={compact ? t('explore.anyLocation') : t('landing.search')}
          type="search"
          value={query}
        />
      </label>
      {showTenantSelect ? (
        <label
          className={cx(
            'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm',
            'flex min-h-14 items-center gap-3 border-b border-border px-5 py-3.5',
            'flex items-center gap-3 border-b border-border px-5 py-3.5 sm:border-b-0 sm:border-r',
          )}
        >
          <span className="sr-only">{t('nav.community')}</span>
          <select
            className="flex-1 bg-transparent text-sm font-semibold outline-none"
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
      ) : null}
      <div className="relative">
        <button
          aria-expanded={dateOpen}
          className={cx(
            'flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm hover:bg-muted/60',
            'flex min-h-14 w-full items-center gap-3 border-b border-border px-5 py-3.5 text-base text-text-muted hover:bg-muted/60',
            'flex min-h-16 w-full items-center gap-4 px-6 py-4 text-xl text-text-muted hover:bg-muted/60 sm:w-auto md:min-w-64 md:px-8',
          )}
          onClick={() => setDateOpen((open) => !open)}
          type="button"
        >
          <Calendar aria-hidden="true" className={cx('h-4 w-4 flex-shrink-0', 'h-5 w-5 flex-shrink-0', 'h-6 w-6 flex-shrink-0')} />
          <span>{dateLabel}</span>
        </button>
        {dateOpen ? (
          <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-[var(--shadow-lg)]">
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
        className={cx(
          'min-h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90',
          'min-h-14 rounded-b-[var(--radius-xl)] bg-foreground px-5 py-3.5 text-base font-bold text-background transition hover:opacity-90',
          'search-panel-submit min-h-16 bg-foreground px-8 py-4 text-xl font-bold text-background transition hover:opacity-90 md:px-12',
        )}
        type="submit"
      >
        {t('landing.searchButton')}
      </button>
    </form>
  )
}
