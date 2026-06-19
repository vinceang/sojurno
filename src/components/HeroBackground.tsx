/**
 * Landing hero backdrop: a soft tri-tone accent aura (see `.sj-hero-aura`) layered
 * under faint topographic contour lines. Contours are the shared visual vocabulary of
 * every Sojurno community — route maps, elevation, trails — without depicting any one
 * discipline, which keeps the multi-tenant hero neutral. Purely decorative and inert.
 */

// Stacked wave paths read as elevation contours. One shared wave shape, offset down the
// band, drawn in the foreground color at very low opacity so the lead copy stays legible.
const CONTOUR_OFFSETS = [40, 120, 200, 280, 360, 440, 520]

function contourPath(y: number): string {
  return `M -40 ${y} C 240 ${y - 56}, 480 ${y + 56}, 760 ${y} S 1240 ${y - 56}, 1240 ${y}`
}

export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="sj-hero-aura absolute inset-0" />
      <svg
        className="absolute inset-0 h-full w-full text-foreground opacity-[0.05]"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 560"
      >
        {CONTOUR_OFFSETS.map((y) => (
          <path d={contourPath(y)} key={y} stroke="currentColor" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  )
}
