import { Star } from 'lucide-react'

type RatingProps = {
  rating: number
  count?: number
}

export function Rating({ count, rating }: RatingProps) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <Star aria-hidden="true" className="h-4 w-4 fill-accent text-accent" />
      {rating.toFixed(2)}
      {count ? <span className="font-normal text-text-muted">({count})</span> : null}
    </span>
  )
}
