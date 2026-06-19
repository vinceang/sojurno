import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TENANTS } from '../tenants/tenants'
import { ExploreFilterBar, type ExploreView, type SortKey } from './ExploreFilterBar'

const runners = TENANTS.filter((tenant) => tenant.active)[0]

const meta = {
  title: 'Product/ExploreFilterBar',
  parameters: {
    a11y: { test: 'error' },
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function InteractiveFilterBar() {
  const [location, setLocation] = useState('')
  const [perksActive, setPerksActive] = useState(false)
  const [tripType, setTripType] = useState('all')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [view, setView] = useState<ExploreView>('grid')

  return (
    <div className="p-8">
      <ExploreFilterBar
        location={location}
        onLocationChange={setLocation}
        onPerksToggle={() => setPerksActive((active) => !active)}
        onSortChange={setSort}
        onTripTypeChange={setTripType}
        onViewChange={setView}
        perksActive={perksActive}
        sort={sort}
        tenant={runners}
        tripType={tripType}
        view={view}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveFilterBar />,
}
