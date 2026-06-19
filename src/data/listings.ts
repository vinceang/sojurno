import { HIKER_GEAR } from './gear'
import { DB_LISTINGS } from './listings.generated'
import type { ActiveTenantId, Listing, ListingImage, Review } from '../types'

function unsplash(id: string, width = 1200, height = 900): string {
  return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format&q=82`
}

function portrait(n: number): string {
  return `https://i.pravatar.cc/96?img=${n}`
}

// Hand-authored origin of the 12 seed listings (incl. the linked external-booking demos). As of
// ADR-0022 these now live in Supabase (source='seed') and reach the app via listings.generated.ts
// like every other listing. This array is kept only as the re-backfill source for
// scripts/backfill-seed.ts — it is NOT used by the app, so it tree-shakes out of the bundle.
export const SEED_LISTINGS: Listing[] = [
  {
    id: 'back-bay-split',
    tenant: 'runners',
    bookingMode: 'native',
    title: 'Back Bay brownstone two blocks from the marathon buses',
    location: 'Boston, MA',
    neighborhood: 'Back Bay',
    price: 214,
    rating: 4.98,
    reviewCount: 86,
    host: {
      name: 'Mara',
      avatar: 'MR',
      avatarUrl: portrait(47),
      badge: '12 marathons hosted',
      bio: 'Boston local, pacer, and expert in race-week logistics from shakeout routes to bag check timing.',
    },
    images: [
      {
        src: unsplash('photo-1560448204-e02f11c3d0e2'),
        alt: 'Warm living room in a Boston brownstone.',
      },
    ],
    tags: ['Start-line shuttle', 'Early breakfast', 'Foam roller'],
    amenities: ['Flexible race morning checkout', 'Kitchen stocked for breakfast', 'Quiet room away from street'],
    highlight: 'The host maps an easy shakeout loop along the Charles before race day.',
    description:
      'A calm, polished base for runners who want the city close and race morning made simple. The apartment keeps the practical things easy: breakfast space, quiet sleep, transit guidance, and a host who has done the weekend many times.',
  },
  {
    id: 'brooklyn-pacehouse',
    tenant: 'runners',
    bookingMode: 'external',
    externalUrl: 'https://www.airbnb.com/',
    title: 'Park Slope pace house near Prospect Park loops',
    location: 'Brooklyn, NY',
    neighborhood: 'Park Slope',
    price: 188,
    rating: 4.94,
    reviewCount: 64,
    host: {
      name: 'Andre',
      avatar: 'AK',
      avatarUrl: portrait(12),
      badge: 'NYC running club host',
      bio: 'Club runner who knows Prospect Park, subway timing, and the difference between a jog and a shakeout.',
    },
    images: [
      {
        src: unsplash('photo-1600585154340-be6161a56a0c'),
        alt: 'Bright Brooklyn townhouse bedroom.',
      },
    ],
    tags: ['Externally booked', 'Park loop nearby', 'Club host'],
    amenities: ['Secure gear corner', 'Park route notes', 'Coffee before sunrise'],
    highlight: 'Linked listing: discover through Sojurno, book on the host-owned external page.',
    description:
      'A community-vetted runner stay near Prospect Park. This listing is host-owned and booked externally, clearly signposted so the transaction stays where the host already manages it.',
  },
  {
    id: 'chicago-lakefront',
    tenant: 'runners',
    bookingMode: 'native',
    title: 'Lakefront studio built around race-week calm',
    location: 'Chicago, IL',
    neighborhood: 'South Loop',
    price: 172,
    rating: 4.96,
    reviewCount: 72,
    host: {
      name: 'Talia',
      avatar: 'TS',
      avatarUrl: portrait(45),
      badge: 'Course volunteer',
      bio: 'Chicago volunteer and runner who knows corrals, trains, lakefront miles, and where to decompress.',
    },
    images: [
      {
        src: unsplash('photo-1505693416388-ac5ce068fe85'),
        alt: 'Minimal studio bedroom with soft morning light.',
      },
    ],
    tags: ['Transit easy', 'Course volunteer', 'Quiet studio'],
    amenities: ['Blackout curtains', 'Transit notes', 'Recovery snacks'],
    highlight: 'A quiet South Loop stay with a host who knows the course logistics.',
    description:
      'Simple, bright, and quiet enough to protect the taper. The stay is designed for runners who want walkable food, easy trains, and someone local who understands the race-week mental state.',
  },
  {
    id: 'sf-crissy-field',
    tenant: 'runners',
    bookingMode: 'native',
    title: 'Serene guest suite near Crissy Field trail network',
    location: 'San Francisco, CA',
    neighborhood: 'Marina District',
    price: 196,
    rating: 4.95,
    reviewCount: 52,
    host: {
      name: 'Daniel',
      avatar: 'DL',
      avatarUrl: portrait(33),
      badge: 'Ultra runner',
      bio: 'Bay Area runner who knows bridge miles, coastal wind, and where to recover after a long morning.',
    },
    images: [
      {
        src: unsplash('photo-1522708323590-d24dbb6b0267'),
        alt: 'Compact guest suite with a bright kitchen and sitting area.',
      },
    ],
    tags: ['Trail maps', 'Pre-dawn kitchen', 'Recovery nook'],
    amenities: ['Washer for race kit', 'Bridge route notes', 'Quiet garden entrance'],
    highlight: 'A calm Marina base for runners mixing road miles, park loops, and coastal trails.',
    description:
      'A small, composed guest suite for runners who want early access to Crissy Field, the Presidio, and bridge routes. The host keeps route notes practical and the space quiet after long efforts.',
  },
  {
    id: 'austin-east-loop',
    tenant: 'runners',
    bookingMode: 'native',
    title: 'East Austin bungalow steps from the Lady Bird trail',
    location: 'Austin, TX',
    neighborhood: 'East Austin',
    price: 179,
    rating: 4.93,
    reviewCount: 61,
    host: {
      name: 'Priya',
      avatar: 'PR',
      avatarUrl: portrait(5),
      badge: 'Trail-series host',
      bio: 'Austin runner who knows the Lady Bird loop, summer heat timing, and the best taco recovery stops.',
    },
    images: [
      {
        src: unsplash('photo-1502005229762-cf1b2da7c5d6'),
        alt: 'Sunlit bungalow living room with warm wood floors.',
      },
    ],
    tags: ['Trail access', 'Heat-smart timing', 'Recovery tacos'],
    amenities: ['Pre-dawn coffee', 'Cold hose for ice baths', 'Shaded route notes'],
    highlight: 'A host who plans your miles around Austin heat and the Lady Bird loop.',
    description:
      'A relaxed East Austin base for runners who want trail access without a car. The host keeps mornings early, hydration easy, and route advice tuned to the season.',
  },
  {
    id: 'philly-schuylkill',
    tenant: 'runners',
    bookingMode: 'native',
    title: 'Fairmount rowhouse on the Schuylkill river loop',
    location: 'Philadelphia, PA',
    neighborhood: 'Fairmount',
    price: 165,
    rating: 4.91,
    reviewCount: 44,
    host: {
      name: 'Marcus',
      avatar: 'MJ',
      avatarUrl: portrait(60),
      badge: 'Marathon pacer',
      bio: 'Philly pacer who runs Kelly Drive daily and knows where the river loop is flattest and quietest.',
    },
    images: [
      {
        src: unsplash('photo-1502672260266-1c1ef2d93688'),
        alt: 'Tidy rowhouse bedroom with soft natural light.',
      },
    ],
    tags: ['River loop', 'Flat miles', 'Pacer host'],
    amenities: ['Foam roller', 'Loop distance markers', 'Quiet street'],
    highlight: 'Step out the door onto the flat, scenic Schuylkill river loop.',
    description:
      'A straightforward Fairmount rowhouse for runners who want flat river miles and an easy taper. The host shares pacing notes and keeps the house calm before race morning.',
  },
  {
    id: 'whitney-portal-cabin',
    tenant: 'hikers',
    bookingMode: 'native',
    title: 'Portal cabin with bear canister and trail beta',
    location: 'Lone Pine, CA',
    neighborhood: 'Whitney Portal',
    price: 236,
    rating: 4.99,
    reviewCount: 91,
    host: {
      name: 'Elena',
      avatar: 'ER',
      avatarUrl: portrait(31),
      badge: 'Backcountry host',
      bio: 'Sierra hiker with local permit knowledge, gear to lend, and a habit of leaving coffee ready early.',
    },
    images: [
      {
        src: unsplash('photo-1449158743715-0a90ebb6d2d8'),
        alt: 'Cabin bedroom near mountain trailheads.',
      },
    ],
    tags: ['Gear included', 'Permit guidance', 'Trailhead nearby'],
    amenities: ['Pack staging area', 'Drying hooks', 'Early trail breakfast'],
    highlight: 'Borrow a bear canister, poles, or GPS without turning your flight into a gear puzzle.',
    description:
      'A trail-ready cabin for hikers who need practical support before a big day outside. The host can lend key gear and talk through conditions without making the stay feel like a rental counter.',
    gear: HIKER_GEAR,
  },
  {
    id: 'olympic-rainroom',
    tenant: 'hikers',
    bookingMode: 'native',
    title: 'Rainforest room with drying wall and route notes',
    location: 'Port Angeles, WA',
    neighborhood: 'Olympic foothills',
    price: 198,
    rating: 4.97,
    reviewCount: 58,
    host: {
      name: 'Noah',
      avatar: 'NP',
      avatarUrl: portrait(68),
      badge: 'Search-and-rescue volunteer',
      bio: 'Olympic Peninsula hiker who tracks weather windows and knows when a backup route is the right call.',
    },
    images: [
      {
        src: unsplash('photo-1510798831971-661eb04b3739'),
        alt: 'Wood cabin exterior surrounded by forest.',
      },
    ],
    tags: ['Drying wall', 'Weather beta', 'Pack storage'],
    amenities: ['Mudroom', 'Weather updates', 'Trailhead shuttle notes'],
    highlight: 'A practical base for wet trails, gear drying, and realistic morning decisions.',
    description:
      'Built for hikers arriving with wet layers and changing plans. The stay is quiet and warm, with a host who can help turn a forecast into a sensible route.',
    gear: HIKER_GEAR.slice(0, 3),
  },
  {
    id: 'glacier-linked',
    tenant: 'hikers',
    bookingMode: 'external',
    externalUrl: 'https://www.airbnb.com/',
    title: 'West Glacier bunkhouse linked from a local trail host',
    location: 'West Glacier, MT',
    neighborhood: 'Park entrance',
    price: 221,
    rating: 4.92,
    reviewCount: 47,
    host: {
      name: 'Mae',
      avatar: 'ML',
      avatarUrl: portrait(16),
      badge: 'Trail community host',
      bio: 'Long-distance hiker and local host who keeps route notes current through shoulder season.',
    },
    images: [
      {
        src: unsplash('photo-1500530855697-b586d89ba3ee'),
        alt: 'Cozy house patio with mountain view.',
      },
    ],
    tags: ['Externally booked', 'Park access', 'Local beta'],
    amenities: ['Route notes', 'Boot storage', 'Bear safety guidance'],
    highlight: 'This host links their existing stay while keeping the affinity context on Sojurno.',
    description:
      'A linked hiker stay for travelers who want the community trust layer but will complete booking on the host-owned external listing.',
  },
  {
    id: 'north-fork-cabin',
    tenant: 'hikers',
    bookingMode: 'native',
    title: 'North Fork cabin gateway to Glacier NP trails',
    location: 'West Glacier, MT',
    neighborhood: 'North Fork',
    price: 211,
    rating: 4.94,
    reviewCount: 37,
    host: {
      name: 'Lily',
      avatar: 'LC',
      avatarUrl: portrait(20),
      badge: 'Glacier guide',
      bio: 'Seasonal guide with a practical eye for trail closures, shuttle timing, and bear country basics.',
    },
    images: [
      {
        src: unsplash('photo-1470770903676-69b98201ea1c'),
        alt: 'Mountain cabin near a lake and forested trails.',
      },
    ],
    tags: ['Bear country prep', 'Shuttle advice', 'Trail closure notes'],
    amenities: ['Bear spray guidance', 'Boot drying space', 'Early coffee setup'],
    highlight: 'A low-key cabin with current trail notes and a host who knows when plans need to change.',
    description:
      'A practical Glacier base for hikers who need local judgment as much as a bed. The cabin keeps mornings simple, with room for packs, boot drying, and direct advice before the day gets moving.',
    gear: HIKER_GEAR.slice(1, 5),
  },
  {
    id: 'bend-cascade-loft',
    tenant: 'hikers',
    bookingMode: 'native',
    title: 'Cascade loft with gear wall near Bend trailheads',
    location: 'Bend, OR',
    neighborhood: 'Old Mill',
    price: 205,
    rating: 4.95,
    reviewCount: 53,
    host: {
      name: 'Sage',
      avatar: 'SW',
      avatarUrl: portrait(53),
      badge: 'Cascade trail host',
      bio: 'Bend hiker who tracks snow lines, alpine windows, and which lakes are worth the early start.',
    },
    images: [
      {
        src: unsplash('photo-1493809842364-78817add7ffb'),
        alt: 'Cabin loft interior with large windows facing forest.',
      },
    ],
    tags: ['Gear wall', 'Snow-line beta', 'Early starts'],
    amenities: ['Pack staging', 'Trail snack pantry', 'Boot drying rack'],
    highlight: 'Borrow poles or a canister and get current snow-line notes before heading up.',
    description:
      'A bright loft for hikers basing out of Bend. The host lends key gear and keeps alpine timing realistic, so big days start prepared instead of guessing.',
    gear: HIKER_GEAR.slice(0, 4),
  },
  {
    id: 'asheville-blue-ridge',
    tenant: 'hikers',
    bookingMode: 'native',
    title: 'Blue Ridge cabin with drying porch near the parkway',
    location: 'Asheville, NC',
    neighborhood: 'West Asheville',
    price: 189,
    rating: 4.93,
    reviewCount: 39,
    host: {
      name: 'Jonah',
      avatar: 'JB',
      avatarUrl: portrait(54),
      badge: 'Appalachian trail host',
      bio: 'Blue Ridge hiker who knows parkway closures, fog windows, and the quiet approaches to busy summits.',
    },
    images: [
      {
        src: unsplash('photo-1540518614846-7eded433c457'),
        alt: 'Wooden cabin nestled among forested hills.',
      },
    ],
    tags: ['Parkway access', 'Fog beta', 'Quiet approaches'],
    amenities: ['Covered drying porch', 'Trail maps', 'Early breakfast'],
    highlight: 'A host who routes you around parkway fog and the crowded summit hours.',
    description:
      'A calm Blue Ridge cabin for hikers who want parkway access and local judgment on weather. The drying porch and early breakfast keep multi-day plans simple.',
    gear: HIKER_GEAR.slice(2, 5),
  },
]

// The seam (ADR-0022): every listing — seed and generated alike — comes from Supabase, built into
// listings.generated.ts via `npm run export:listings`. The DB is the single source of truth; this
// committed file is the build artifact the static app reads synchronously.
export const LISTINGS: Listing[] = DB_LISTINGS

export function getListingsByTenant(tenant: ActiveTenantId): Listing[] {
  return LISTINGS.filter((listing) => listing.tenant === tenant)
}

export function getListing(id: string | undefined): Listing | undefined {
  return LISTINGS.find((listing) => listing.id === id)
}

/**
 * A gallery of 5 images for the listing detail page: the listing's own photo
 * first, then filled from other listings' (already-verified) interior shots so
 * the mosaic stays populated until per-listing photo sets exist (→ ADR-0016).
 */
export function getGallery(listing: Listing): ListingImage[] {
  const own = listing.images
  const fillers = LISTINGS.filter((other) => other.id !== listing.id).map((other) => ({
    src: other.images[0]?.src,
    alt: 'Interior view',
  }))
  return [...own, ...fillers].slice(0, 5)
}

// Community-flavored sample reviews (marketplace content — single-language per
// ADR-0016). Shown on every listing of that tenant until per-listing reviews exist.
const REVIEWS: Record<ActiveTenantId, Review[]> = {
  runners: [
    {
      name: 'Alex M.',
      avatarUrl: portrait(13),
      date: 'March 2026',
      text: 'Perfect setup for race day. Left coffee out at 5am and the route maps were exactly right — back for the fall half.',
    },
    {
      name: 'Tarini R.',
      avatarUrl: portrait(49),
      date: 'January 2026',
      text: 'Stayed here for the marathon and it was seamless. The foam roller and recovery snacks were a thoughtful touch after a hard effort.',
    },
  ],
  hikers: [
    {
      name: 'Devon K.',
      avatarUrl: portrait(15),
      date: 'February 2026',
      text: 'The loaner gear saved my trip — borrowed a canister and poles. Host knew exactly which trailhead to start from given the snow.',
    },
    {
      name: 'Priya S.',
      avatarUrl: portrait(41),
      date: 'December 2025',
      text: 'Quiet, warm, and a real drying space for wet layers. The trail beta the host shared changed our whole route for the better.',
    },
  ],
}

export function getReviews(listing: Listing): Review[] {
  return REVIEWS[listing.tenant]
}
