import type { ListingImage } from '../types'

type ListingGalleryProps = {
  images: ListingImage[]
}

/**
 * Mobile (< sm): a horizontal scroll-snap carousel of the photos.
 * sm+: a mosaic — one large image (2×2) + up to four small ones.
 */
export function ListingGallery({ images }: ListingGalleryProps) {
  const [hero, ...rest] = images

  return (
    <>
      {/* Mobile carousel */}
      <div className="-mx-[var(--space-page)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--space-page)] pb-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((image, index) => (
          <div
            className="aspect-[4/3] w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl bg-muted"
            key={`${image.src}-${index}`}
          >
            <img alt={image.alt} className="h-full w-full object-cover" loading="lazy" src={image.src} />
          </div>
        ))}
      </div>

      {/* sm+ mosaic */}
      <div className="hidden h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:grid">
        {hero ? (
          <div className="col-span-2 row-span-2 bg-muted">
            <img alt={hero.alt} className="h-full w-full object-cover" src={hero.src} />
          </div>
        ) : null}
        {rest.slice(0, 4).map((image, index) => (
          <div className="overflow-hidden bg-muted" key={`${image.src}-${index}`}>
            <img alt={image.alt} className="h-full w-full object-cover" loading="lazy" src={image.src} />
          </div>
        ))}
      </div>
    </>
  )
}
