import type { GearItem } from '../types'

export const HIKER_GEAR: GearItem[] = [
  {
    id: 'poles',
    name: 'Trekking poles',
    category: 'Trail support',
    icon: 'poles',
    quantity: 2,
    fee: undefined,
  },
  {
    id: 'bear-canister',
    name: 'Bear canister',
    category: 'Food safety',
    icon: 'canister',
    quantity: 1,
    fee: undefined,
  },
  {
    id: 'gps',
    name: 'Satellite GPS',
    category: 'Navigation',
    icon: 'gps',
    quantity: 1,
    fee: undefined,
  },
  {
    id: 'stove',
    name: 'Compact stove',
    category: 'Camp kitchen',
    icon: 'stove',
    quantity: 1,
    fee: undefined,
  },
]

export const CLIMBER_GEAR: GearItem[] = [
  {
    id: 'rope',
    name: 'Dynamic climbing rope (60m)',
    category: 'Protection',
    icon: 'rope',
    quantity: 1,
    fee: undefined,
  },
  {
    id: 'harness',
    name: 'Harness + belay device',
    category: 'Protection',
    icon: 'harness',
    quantity: 2,
    fee: undefined,
  },
  {
    id: 'helmet',
    name: 'Climbing helmet',
    category: 'Safety',
    icon: 'helmet',
    quantity: 2,
    fee: undefined,
  },
  {
    id: 'crash-pad',
    name: 'Bouldering crash pad',
    category: 'Bouldering',
    icon: 'pack',
    quantity: 1,
    fee: undefined,
  },
  {
    id: 'quickdraws',
    name: 'Quickdraw set',
    category: 'Sport rack',
    icon: 'rope',
    quantity: 1,
    fee: undefined,
  },
]
