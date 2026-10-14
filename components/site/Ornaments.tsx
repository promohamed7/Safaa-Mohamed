import type { CSSProperties } from "react";

/**
 * The vine divider under section headings, drawn as single strokes. Each path has pathLength=1 and data-stroke, so the
 * .draw/.is-in CSS draws it from nothing to full, ring by ring (see globals.css).
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
