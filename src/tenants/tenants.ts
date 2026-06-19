import type { ActiveTenantId, Tenant } from '../types'

const img = (id: string) => `https://images.unsplash.com/${id}?w=1080&h=560&fit=crop&auto=format&q=80`

// Tenants are product configuration, not engine branches.
export const TENANTS = [
  {
    id: 'runners',
    active: true,
    name: 'Runners',
    pluralName: 'Runners',
    tagline: "Stay close to the start line. Stay with someone who's been there.",
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
      tripType: 'Race type',
      collectionsLabel: 'Upcoming races',
    },
    taxonomy: ['Marathon', 'Half marathon', 'Trail race', 'Ultra'],
    trustSignals: ['Verified race history', 'Local route knowledge', 'Race-morning flexibility'],
    capabilities: ['collections'],
    image: { src: img('photo-1571008887538-b36bb32f4571'), alt: 'Runner stretching by the water at sunrise.' },
    stats: {
      listings: 847,
      cities: 62,
    },
  },
  {
    id: 'hikers',
    active: true,
    name: 'Hikers',
    pluralName: 'Hikers',
    tagline: "Trail knowledge, loaner gear, and hosts who've done the miles.",
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
      tripType: 'Hike type',
      collectionsLabel: 'Trails & parks',
    },
    taxonomy: ['Day hike', 'Backpacking', 'Thru-hike', 'Peak bagging'],
    trustSignals: ['Verified trail history', 'Backcountry knowledge', 'Gear-ready host'],
    capabilities: ['gear', 'collections'],
    image: { src: img('photo-1551632811-561732d1e306'), alt: 'Two hikers on a mountain trail with backpacks.' },
    stats: {
      listings: 412,
      cities: 38,
    },
  },
  {
    id: 'cyclists',
    active: false,
    name: 'Cyclists',
    pluralName: 'Cyclists',
    tagline: 'Stays that understand a 5am departure and a muddy kit.',
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
      tripType: 'Ride type',
      collectionsLabel: 'Routes & rides',
    },
    taxonomy: ['Secure bike storage', 'Repair stand', 'Route guidance'],
    trustSignals: ['Verified cycling community', 'Local route knowledge'],
    capabilities: [],
    image: { src: img('photo-1485965120184-e220f721d03e'), alt: 'Cyclist riding on an open road.' },
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
    tagline: 'Near the crag. Hosted by people who know the grades.',
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
      tripType: 'Climb type',
      collectionsLabel: 'Crags & climbs',
    },
    taxonomy: ['Crag proximity', 'Gear storage', 'Local beta'],
    trustSignals: ['Verified climbing community', 'Local area knowledge'],
    capabilities: [],
    image: { src: img('photo-1522163182402-834f871fd851'), alt: 'Climber scaling a sunlit rock face.' },
    stats: {
      listings: 0,
      cities: 0,
    },
  },
  {
    id: 'skiers',
    active: false,
    name: 'Skiers',
    pluralName: 'Skiers',
    tagline: 'Slope-side stays for powder weekends.',
    description: 'Mountain lodging with drying rooms, early lifts, and hosts who read the snow report for you.',
    brand: {
      mark: 'Ski',
      accent: '#0ea5e9',
      accentSoft: '#e0f2fe',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'slope-ready stay',
      proof: 'mountain experience',
      filterPrimary: 'Ski perks',
      tripType: 'Slope type',
      collectionsLabel: 'Resorts & peaks',
    },
    taxonomy: ['Slope access', 'Boot room', 'Early lifts'],
    trustSignals: ['Verified ski community', 'Local snow knowledge'],
    capabilities: [],
    image: { src: img('photo-1551698618-1dfe5d97d256'), alt: 'Skier carving down a snowy alpine slope.' },
    stats: {
      listings: 0,
      cities: 0,
    },
  },
  {
    id: 'music-festivals',
    active: false,
    name: 'Music Festivals',
    pluralName: 'Festival-goers',
    tagline: 'Stays within reach of the main stage.',
    description:
      'Beds near the gates for people who plan their year around lineups, with hosts who know the shuttle routes.',
    brand: {
      mark: 'Fest',
      accent: '#c026d3',
      accentSoft: '#fae8ff',
      typography: 'sojurno-shared',
    },
    vocabulary: {
      stayType: 'festival-ready stay',
      proof: 'festival experience',
      filterPrimary: 'Festival perks',
      tripType: 'Festival type',
      collectionsLabel: 'Upcoming festivals',
    },
    taxonomy: ['Near the gates', 'Late checkout', 'Shuttle routes'],
    trustSignals: ['Verified festival community', 'Local venue knowledge'],
    capabilities: [],
    image: { src: img('photo-1459749411175-04bf5292ceea'), alt: 'Crowd silhouetted against stage lights at a festival.' },
    stats: {
      listings: 0,
      cities: 0,
    },
  },
] satisfies Tenant[]

export const ACTIVE_TENANTS = TENANTS.filter((tenant) => tenant.active)

/** Default tenant to land in for tenant-scoped flows that have no tenant context yet. */
export const DEFAULT_TENANT: ActiveTenantId = 'runners'

export function getTenant(id: string | undefined): Tenant | undefined {
  return TENANTS.find((tenant) => tenant.id === id)
}

export function getActiveTenant(id: string | undefined): Tenant | undefined {
  const tenant = getTenant(id)
  return tenant?.active ? tenant : undefined
}
