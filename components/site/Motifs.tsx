"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import butterfly from "./motifs/butterfly.json";
import deer from "./motifs/deer.json";
import rose from "./motifs/rose.json";
import horse from "./motifs/horse.json";

/**
 * Safaa's own designs, traced from photos of her work into vector shapes (each part is a filled
 * outline, with any holes, placed by a translate). On screen every outline draws itself like a
 * henna cone, then the part fills with colour (see .draw/.is-in in globals.css).
 *
 * Every visit shuffles the designs, and each <Motif slot={n}> on the page shows a different one.
 */

interface TracedDesign {
  id: string;
  label: string;
  viewBox: string;
  paths: { d: string; t: string }[];
}

const DESIGNS = [butterfly, deer, rose, horse].map((design: TracedDesign) => ({
  ...design,
  // Each closed outline ("M … Z") draws as its own stroke; the part fills once all are drawn.
  parts: design.paths.map((p) => ({ ...p, outlines: p.d.split(/(?=M)/) })),
}));

/* ---------- One shuffle per visit ---------- */

const SERVER_ORDER = DESIGNS.map((_, i) => i);
let visitOrder: number[] | null = null;

function shuffledOrder(): number[] {
  if (!visitOrder) {
    visitOrder = SERVER_ORDER.slice();
    for (let i = visitOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [visitOrder[i], visitOrder[j]] = [visitOrder[j], visitOrder[i]];
    }
  }
  return visitOrder;
}

const noSubscribe = () => () => {};

/** Total time to draw one design, whatever its number of outlines. */
const DRAW_SECONDS = 3.6;

/**
 * Give every outline and fill its start time from its place in the design, once the design is on
 * the page. Keeping this out of render keeps server and browser markup identical.
 */
function stagger(svg: SVGSVGElement | null) {
  if (!svg) return;
  const parts = svg.querySelectorAll<SVGElement>("[data-stroke], [data-fill]");
  const step = DRAW_SECONDS / Math.max(parts.length, 1);
  parts.forEach((el, i) => el.style.setProperty("--d", `${(i * step).toFixed(3)}s`));
}

/**
 * One of Safaa's designs for one place on the page. Places use slots 0–3; within one visit every
 * slot shows a different design, and the set is shuffled again on the next visit.
 */
export function Motif({ slot, className = "", strokeWidth = 1.2 }: { slot: number; className?: string; strokeWidth?: number }) {
  const order = useSyncExternalStore(noSubscribe, shuffledOrder, () => SERVER_ORDER);
  const design = DESIGNS[order[slot % DESIGNS.length]];
  return (
    <svg
      key={design.id}
      ref={stagger}
      viewBox={design.viewBox}
      role="img"
      aria-label={`رسمة حنة من أعمال صفاء: ${design.label}`}
      className={`draw ${className}`}
      style={{ "--draw-dur": "1.4s" } as CSSProperties}
    >
      {design.parts.map((part, i) => (
        <g key={i} transform={`translate(${part.t})`}>
          {part.outlines.map((d, j) => (
            <path
              key={j}
              data-stroke
              pathLength={1}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path data-fill d={part.d} fill="currentColor" fillRule="evenodd" stroke="none" />
        </g>
      ))}
    </svg>
  );
}
