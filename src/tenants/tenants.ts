import type { Tenant } from '../types'

// Tenants are product configuration, not engine branches.
export const TENANTS = [
  {
    id: 'runners',
    active: true,
    name: 'Runners',
    pluralName: 'Runners',
    tagline: 'Race-ready stays in cities you are running.',
    description:
      'Homes near start lines, shakeout routes, and hosts who understand early alarms, carb timing, and race-week logistics.',
    brand: {
      mark: 'Run',
      accent: '#e8651a',
      accentSoft: '#fef3ec',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'race-ready stay',
      proof: 'race experience',
      filterPrimary: 'Race perks',
    },
    taxonomy: ['Start-line proximity', 'Shakeout routes', 'Early breakfast', 'Late checkout'],
    trustSignals: ['Verified race history', 'Local route knowledge', 'Race-morning flexibility'],
    capabilities: [],
    stats: {
      listings: 42,
      cities: 12,
    },
  },
  {
    id: 'hikers',
    active: true,
    name: 'Hikers',
    pluralName: 'Hikers',
    tagline: 'Trailhead-close stays with the kit waiting.',
    description:
      'Remote stays, trail beta, and host-lent gear for travelers who need more than a bed before a long day outside.',
    brand: {
      mark: 'Hike',
      accent: '#2d6a4f',
      accentSoft: '#eefaef',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'trail-ready stay',
      proof: 'backcountry experience',
      filterPrimary: 'Gear included',
    },
    taxonomy: ['Trailhead proximity', 'Gear lending', 'Permit guidance', 'Pack storage'],
    trustSignals: ['Verified trail history', 'Backcountry knowledge', 'Gear-ready host'],
    capabilities: ['gear'],
    stats: {
      listings: 38,
      cities: 9,
    },
  },
  {
    id: 'cyclists',
    active: false,
    name: 'Cyclists',
    pluralName: 'Cyclists',
    tagline: 'Bike-friendly stays for ride weekends.',
    description: 'Secure storage, route knowledge, and hosts who understand long days on two wheels.',
    brand: {
      mark: 'Cycle',
      accent: '#1a56db',
      accentSoft: '#eff6ff',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'ride-ready stay',
      proof: 'route experience',
      filterPrimary: 'Bike perks',
    },
    taxonomy: ['Secure bike storage', 'Repair stand', 'Route guidance'],
    trustSignals: ['Verified cycling community', 'Local route knowledge'],
    capabilities: [],
    stats: {
      listings: 0,
      cities: 0,
    },
  },
  {
    id: 'climbers',
    active: false,
    name: 'Climbers',
    pluralName: 'Climbers',
    tagline: 'Crag-close stays for climbing trips.',
    description: 'Community-led lodging near climbing zones, with local beta and early starts built in.',
    brand: {
      mark: 'Climb',
      accent: '#9333ea',
      accentSoft: '#faf5ff',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'crag-ready stay',
      proof: 'climbing experience',
      filterPrimary: 'Climbing perks',
    },
    taxonomy: ['Crag proximity', 'Gear storage', 'Local beta'],
    trustSignals: ['Verified climbing community', 'Local area knowledge'],
    capabilities: [],
    stats: {
      listings: 0,
      cities: 0,
    },
  },
] satisfies Tenant[]

export const ACTIVE_TENANTS = TENANTS.filter((tenant) => tenant.active)

export function getTenant(id: string | undefined): Tenant | undefined {
  return TENANTS.find((tenant) => tenant.id === id)
}

export function getActiveTenant(id: string | undefined): Tenant | undefined {
  const tenant = getTenant(id)
  return tenant?.active ? tenant : undefined
}
