import type { ActiveTenantId, Collection } from '../types'

const img = (id: string) => `https://images.unsplash.com/${id}?w=900&h=560&fit=crop&auto=format&q=80`

// Collections are marketplace content (single-language per ADR-0016) and mock
// data (no backend per ADR-0017). A collection groups listings a community
// converges on: runners → races (events), hikers → trails/parks (places).
export const COLLECTIONS: Collection[] = [
  // Runners — events
  {
    id: 'boston-marathon',
    tenant: 'runners',
    kind: 'event',
    title: 'Boston Marathon',
    summary: 'Stays near the Hopkinton start and the Boylston finish, hosted by runners who know the point-to-point logistics.',
    image: { src: img('photo-1452626038306-9aae5e071dd3'), alt: 'Runners on a city marathon course.' },
    location: 'Boston, MA',
    dateLabel: 'Apr 20',
    listingIds: ['back-bay-split', 'chicago-lakefront', 'sf-crissy-field'],
  },
  {
    id: 'nyc-marathon',
    tenant: 'runners',
    kind: 'event',
    title: 'NYC Marathon',
    summary: 'Five-borough race weekend bases with hosts who understand the ferry, the corrals, and the long bus to Staten Island.',
    image: { src: img('photo-1530549387789-4c1017266635'), alt: 'Crowd of marathon runners at the start.' },
    location: 'New York, NY',
    dateLabel: 'Nov 2',
    listingIds: ['brooklyn-pacehouse', 'back-bay-split'],
  },
  {
    id: 'chicago-marathon',
    tenant: 'runners',
    kind: 'event',
    title: 'Chicago Marathon',
    summary: 'Flat-and-fast weekend stays near the Grant Park start, with lakefront shakeout routes a few blocks away.',
    image: { src: img('photo-1547483238-f400e65ccd56'), alt: 'Runner racing on an open road.' },
    location: 'Chicago, IL',
    dateLabel: 'Oct 12',
    listingIds: ['chicago-lakefront', 'philly-schuylkill'],
  },
  {
    id: 'austin-trail-series',
    tenant: 'runners',
    kind: 'event',
    title: 'Austin Trail Series',
    summary: 'Greenbelt and Lady Bird loop stays for the spring trail series, hosted by runners who time around the Texas heat.',
    image: { src: img('photo-1486218119243-13883505764c'), alt: 'Trail runner on a wooded path.' },
    location: 'Austin, TX',
    dateLabel: 'Mar 8',
    listingIds: ['austin-east-loop', 'sf-crissy-field'],
  },
  // Hikers — places
  {
    id: 'john-muir-trail',
    tenant: 'hikers',
    kind: 'place',
    title: 'John Muir Trail',
    summary: '211 miles through the High Sierra. Trailhead-close stays with hosts who lend canisters and read the permit lottery.',
    image: { src: img('photo-1454496522488-7a8e488e8606'), alt: 'Snowy Sierra peaks above an alpine valley.' },
    location: 'Sierra Nevada, CA',
    listingIds: ['whitney-portal-cabin', 'bend-cascade-loft'],
  },
  {
    id: 'olympic-national-park',
    tenant: 'hikers',
    kind: 'place',
    title: 'Olympic National Park',
    summary: 'Rainforest, coast, and alpine in one park. Stays with drying rooms and hosts who track the weather windows.',
    image: { src: img('photo-1483721310020-03333e577078'), alt: 'Mossy temperate rainforest trail.' },
    location: 'Washington',
    listingIds: ['olympic-rainroom', 'north-fork-cabin'],
  },
  {
    id: 'glacier-national-park',
    tenant: 'hikers',
    kind: 'place',
    title: 'Glacier National Park',
    summary: 'Going-to-the-Sun country. Park-entrance stays with bear-country guidance and current trail-closure notes.',
    image: { src: img('photo-1540518614846-7eded433c457'), alt: 'Forested cabin below mountain ridges.' },
    location: 'Montana',
    listingIds: ['glacier-linked', 'north-fork-cabin'],
  },
  {
    id: 'blue-ridge-parkway',
    tenant: 'hikers',
    kind: 'place',
    title: 'Blue Ridge Parkway',
    summary: 'Ridgeline miles and quiet approaches to busy summits, with hosts who route you around the parkway fog.',
    image: { src: img('photo-1486870591958-9b9d0d1dda99'), alt: 'Blue Ridge mountains in layered haze.' },
    location: 'North Carolina',
    listingIds: ['asheville-blue-ridge', 'olympic-rainroom'],
  },
]

export function getCollectionsByTenant(tenant: ActiveTenantId): Collection[] {
  return COLLECTIONS.filter((collection) => collection.tenant === tenant)
}

export function getCollection(id: string | undefined): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.id === id)
}
