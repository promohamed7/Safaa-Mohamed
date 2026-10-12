import type { CSSProperties } from "react";

/**
 * Henna motifs drawn as single strokes. Each path has pathLength=1 and data-stroke, so the
 * .draw/.is-in CSS draws it from nothing to full, ring by ring (see globals.css).
 */

const ring = (count: number) => Array.from({ length: count }, (_, i) => (360 / count) * i);
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Mandala({ className = "", strokeWidth = 1.1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden className={`draw ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle data-stroke pathLength={1} r={9} style={delay(0)} />
      <circle data-stroke pathLength={1} r={4} style={delay(0.1)} />
      {ring(8).map((a) => (
        <circle key={`d1-${a}`} data-dot r={1.6} fill="currentColor" stroke="none" transform={`rotate(${a}) translate(0 -15)`} style={delay(0.3)} />
      ))}
      {ring(12).map((a, i) => (
        <g key={`p-${a}`} transform={`rotate(${a})`}>
          <path data-stroke pathLength={1} d="M0,-20 C9,-28 9,-40 0,-49 C-9,-40 -9,-28 0,-20 Z" style={delay(0.4 + i * 0.05)} />
          <path data-stroke pathLength={1} d="M0,-25 L0,-43" style={delay(0.9 + i * 0.05)} />
        </g>
      ))}
      <circle data-stroke pathLength={1} r={54} style={delay(1.1)} />
      <circle data-dot r={57.5} strokeDasharray="0.6 3.4" style={delay(1.2)} />
      {ring(16).map((a, i) => (
        <g key={`t-${a}`} transform={`rotate(${a + 11.25})`}>
          <path data-stroke pathLength={1} d="M0,-61 C7,-67 7,-77 0,-86 C-7,-77 -7,-67 0,-61 Z" style={delay(1.4 + i * 0.04)} />
          <path data-stroke pathLength={1} d="M0,-66 C3,-70 3,-75 0,-80" style={delay(1.9 + i * 0.04)} />
        </g>
      ))}
      {ring(32).map((a) => (
        <circle key={`d2-${a}`} data-dot r={1.3} fill="currentColor" stroke="none" transform={`rotate(${a}) translate(0 -92)`} style={delay(2.3)} />
      ))}
    </svg>
  );
}

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
