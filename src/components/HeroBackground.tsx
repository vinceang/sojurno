/**
 * Landing hero backdrop: a soft tri-tone accent aura (see `.sj-hero-aura`) that blends the
 * three active community accents (ember/pine/violet), so the hero reads as the multi-tenant
 * engine rather than any single discipline. Purely decorative and inert.
 *
 * `texture` adds an optional fine film-grain over the aura — an `feTurbulence` fractal noise
 * desaturated to grayscale and blended at low opacity. It adds editorial depth and hides any
 * gradient banding without introducing a literal motif. Pass `texture="none"` for the bare aura.
 */
type HeroBackgroundProps = {
  texture?: 'grain' | 'none'
}

export function HeroBackground({ texture = 'grain' }: HeroBackgroundProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="sj-hero-aura absolute inset-0" />
      {texture === 'grain' && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.4] mix-blend-soft-light">
          <filter id="hero-grain">
            <feTurbulence baseFrequency="0.82" numOctaves={2} stitchTiles="stitch" type="fractalNoise" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect filter="url(#hero-grain)" height="100%" width="100%" />
        </svg>
      )}
    </div>
  )
}
