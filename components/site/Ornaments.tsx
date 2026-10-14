import type { CSSProperties } from "react";

/**
 * Line drawings around the page: a vine under section headings, leafy sprigs and small flowers.
 * Each path has pathLength=1 and data-stroke, so the .draw/.is-in CSS draws it from nothing to
 * full, part by part (see globals.css).
 */

const ring = (count: number) => Array.from({ length: count }, (_, i) => (360 / count) * i);
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** A section divider: a vine with leaves around a small flower. */
export function Vine({ className = "" }: { className?: string }) {
  const leaves = [60, 140, 260, 340];
  return (
    <svg viewBox="0 0 400 40" aria-hidden className={`draw ${className}`} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" style={{ "--draw-dur": "1.8s" } as CSSProperties}>
      <path data-stroke pathLength={1} d="M10 20 C 50 4, 90 36, 130 20 S 165 8, 178 20" style={delay(0)} />
      <path data-stroke pathLength={1} d="M390 20 C 350 4, 310 36, 270 20 S 235 8, 222 20" style={delay(0)} />
      {leaves.map((x, i) => {
        const up = i % 2 === 0;
        const y = up ? 13 : 27;
        return <path key={x} data-stroke pathLength={1} d={`M${x} ${y} q 8 ${up ? -10 : 10} 18 ${up ? -6 : 6} q -10 ${up ? 8 : -8} -18 ${up ? 6 : -6} Z`} style={delay(0.8 + i * 0.1)} />;
      })}
      <g transform="translate(200 20)">
        {ring(6).map((a) => (
          <path key={a} data-stroke pathLength={1} transform={`rotate(${a})`} d="M0,-3 C4,-7 4,-12 0,-16 C-4,-12 -4,-7 0,-3 Z" style={delay(1)} />
        ))}
        <circle data-dot r={2} fill="currentColor" stroke="none" style={delay(1.5)} />
      </g>
    </svg>
  );
}

/** One leaf, its base at the origin and pointing along +x, with a midrib. */
const leaf = (l: number) => ({
  blade: `M0 0 C ${l * 0.3} ${-l * 0.32}, ${l * 0.78} ${-l * 0.26}, ${l} 0 C ${l * 0.78} ${l * 0.26}, ${l * 0.3} ${l * 0.32}, 0 0 Z`,
  rib: `M${l * 0.08} 0 L ${l * 0.8} 0`,
});

// Points along the stem, the angle the leaf grows at, and its length.
const SPRIG_LEAVES = [
  { x: 59, y: 168, a: -28, l: 34 },
  { x: 58, y: 146, a: 208, l: 32 },
  { x: 61, y: 120, a: -34, l: 30 },
  { x: 60, y: 96, a: 214, l: 28 },
  { x: 59, y: 72, a: -40, l: 24 },
  { x: 60, y: 50, a: 220, l: 21 },
  { x: 62, y: 30, a: -48, l: 17 },
];

/** A leafy sprig drawn in thin lines, like the botanical sketches on a henna studio's cards. */
export function Sprig({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden className={`draw ${className}`} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ "--draw-dur": "1.6s", ...style } as CSSProperties}>
      <path data-stroke pathLength={1} d="M60 196 C 52 160, 66 128, 59 92 S 60 34, 63 8" style={delay(0)} />
      {SPRIG_LEAVES.map((p, i) => {
        const { blade, rib } = leaf(p.l);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
            <path data-stroke pathLength={1} d={blade} style={delay(0.5 + i * 0.12)} />
            <path data-stroke pathLength={1} d={rib} style={delay(0.7 + i * 0.12)} />
          </g>
        );
      })}
      <g transform="translate(63 8) rotate(-90)">
        <path data-stroke pathLength={1} d={leaf(14).blade} style={delay(1.4)} />
      </g>
    </svg>
  );
}

/** A single flower on a curved stem, in the same thin line as the sprig. */
export function Bloom({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const petal = "M0,-9 C10,-16 12,-34 0,-42 C-12,-34 -10,-16 0,-9 Z";
  const { blade, rib } = leaf(30);
  return (
    <svg viewBox="0 0 120 200" aria-hidden className={`draw ${className}`} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ "--draw-dur": "1.6s", ...style } as CSSProperties}>
      <path data-stroke pathLength={1} d="M60 196 C 54 168, 66 132, 60 102" style={delay(0)} />
      {[
        { x: 59, y: 166, a: -30 },
        { x: 60, y: 140, a: 210 },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
          <path data-stroke pathLength={1} d={blade} style={delay(0.4 + i * 0.15)} />
          <path data-stroke pathLength={1} d={rib} style={delay(0.6 + i * 0.15)} />
        </g>
      ))}
      <g transform="translate(60 60)">
        {ring(8).map((a, i) => (
          <path key={a} data-stroke pathLength={1} transform={`rotate(${a + 22.5})`} d={petal} style={delay(0.8 + i * 0.08)} />
        ))}
        <circle data-stroke pathLength={1} r={8} style={delay(1.5)} />
        <circle data-dot r={3} fill="currentColor" stroke="none" style={delay(1.8)} />
      </g>
    </svg>
  );
}

/** A small five-petal flower, used between words and on cards. */
export function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" aria-hidden className={className} fill="currentColor">
      {ring(5).map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0,-1.5 C3.6,-4.5 3.4,-9.5 0,-10.5 C-3.4,-9.5 -3.6,-4.5 0,-1.5 Z" opacity={0.9} />
      ))}
      <circle r={2} fill="var(--card)" />
    </svg>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`stars ${className}`} role="img" aria-label="٥ نجوم">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
          <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
        </svg>
      ))}
    </span>
  );
}
