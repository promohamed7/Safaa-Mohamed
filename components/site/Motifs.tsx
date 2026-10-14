"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

/**
 * Five line drawings after Safaa's own work: a butterfly on a vine, a flowering hand vine,
 * a deer with leafy antlers, a rose with sparkles, and a horse with a flowing mane.
 * Each stroke has pathLength=1 and data-stroke, so .draw/.is-in in globals.css draws it in order,
 * like a henna cone; filled shapes (data-fill) fade in once their outline is drawn.
 *
 * Every visit shuffles the five; each <Motif slot={n}> on the page takes a different one.
 */

/* ---------- Drawing helpers ---------- */

function Stroke({ d, width }: { d: string; width?: number }) {
  return <path data-stroke pathLength={1} d={d} strokeWidth={width} />;
}

function Fill({ d, opacity = 0.9 }: { d: string; opacity?: number }) {
  return <path data-fill d={d} fill="currentColor" fillOpacity={opacity} stroke="none" />;
}

function Dot({ x, y, r = 2 }: { x: number; y: number; r?: number }) {
  return <circle data-dot cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;
}

/** A pointed henna leaf with a midrib, standing on (x, y) and turned by `angle` degrees. */
function Leaf({ x, y, angle, len = 18, w = 7, filled = false }: { x: number; y: number; angle: number; len?: number; w?: number; filled?: boolean }) {
  const outline = `M0 0 C ${w} ${-len * 0.3} ${w * 0.8} ${-len * 0.75} 0 ${-len} C ${-w * 0.8} ${-len * 0.75} ${-w} ${-len * 0.3} 0 0 Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Stroke d={outline} />
      {filled ? <Fill d={outline} opacity={0.85} /> : <Stroke d={`M0 ${-len * 0.12} L0 ${-len * 0.78}`} />}
    </g>
  );
}

/** An open flower with `count` petals of size `s`, centred on (x, y). */
function Flower({ x, y, s, count = 5, rotate = 0, veins = true }: { x: number; y: number; s: number; count?: number; rotate?: number; veins?: boolean }) {
  const petal = `M0 0 C ${s * 0.5} ${-s * 0.2} ${s * 0.62} ${-s * 0.78} 0 ${-s} C ${-s * 0.62} ${-s * 0.78} ${-s * 0.5} ${-s * 0.2} 0 0 Z`;
  const angles = Array.from({ length: count }, (_, i) => rotate + (360 / count) * i);
  return (
    <g transform={`translate(${x} ${y})`}>
      {angles.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <Stroke d={petal} />
          {veins && <Stroke d={`M0 ${-s * 0.18} L0 ${-s * 0.7}`} />}
        </g>
      ))}
      <circle data-stroke pathLength={1} r={s * 0.16} />
      <Dot x={0} y={0} r={s * 0.07} />
    </g>
  );
}

/** A closed rosebud on (x, y), opening upwards. */
function Bud({ x, y, s = 1, angle = 0 }: { x: number; y: number; s?: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <Stroke d="M0 0 C -8 -4, -9 -13, 0 -21 C 9 -13, 8 -4, 0 0 Z" />
      <Stroke d="M-6 -8 C -3 -13, 3 -13, 6 -8 M-3 -15 C -1 -11, 1 -11, 3 -15" />
      <Stroke d="M0 1 C -3 -2, -7 -3, -10 -2 M0 1 C 3 -2, 7 -3, 10 -2" />
    </g>
  );
}

/** A four-point sparkle. */
function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  const d = `M0 ${-s} Q ${s * 0.12} ${-s * 0.12} ${s} 0 Q ${s * 0.12} ${s * 0.12} 0 ${s} Q ${-s * 0.12} ${s * 0.12} ${-s} 0 Q ${-s * 0.12} ${-s * 0.12} 0 ${-s} Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Stroke d={d} />
      <Fill d={d} />
    </g>
  );
}

/* ---------- The five drawings ---------- */

function ButterflyVine() {
  return (
    <>
      <Stroke d="M88 292 C 70 250, 118 222, 102 184 C 90 156, 66 136, 92 104 C 112 80, 114 52, 138 14" width={2.4} />
      <Leaf x={84} y={262} angle={-62} len={22} />
      <Leaf x={96} y={240} angle={58} len={22} />
      <Leaf x={102} y={208} angle={-50} />
      <Leaf x={80} y={140} angle={-58} len={20} />
      <Leaf x={98} y={98} angle={64} len={20} />
      <Leaf x={112} y={70} angle={-48} />
      <Leaf x={126} y={40} angle={52} len={16} />
      <Bud x={70} y={226} angle={-28} />
      <Bud x={92} y={56} angle={-18} s={0.9} />
      <Bud x={60} y={202} angle={-56} s={0.75} />
      {/* The butterfly, resting on the vine */}
      <g transform="translate(108 160)">
        <Stroke d="M0 -10 C 18 -40, 50 -44, 50 -22 C 50 -6, 26 -2, 0 -4 Z" />
        <Stroke d="M0 -10 C -18 -40, -50 -44, -50 -22 C -50 -6, -26 -2, 0 -4 Z" />
        <Stroke d="M0 -2 C 16 2, 34 14, 26 28 C 18 36, 6 22, 0 4 Z" />
        <Stroke d="M0 -2 C -16 2, -34 14, -26 28 C -18 36, -6 22, 0 4 Z" />
        <Stroke d="M8 -12 C 18 -28, 34 -30, 38 -22 M8 -8 C 20 -12, 32 -12, 40 -14 M-8 -12 C -18 -28, -34 -30, -38 -22 M-8 -8 C -20 -12, -32 -12, -40 -14" />
        <Stroke d="M6 4 C 14 10, 18 18, 20 24 M-6 4 C -14 10, -18 18, -20 24" />
        <Fill d="M0 -10 C 18 -40, 50 -44, 50 -22 C 50 -6, 26 -2, 0 -4 Z M0 -10 C -18 -40, -50 -44, -50 -22 C -50 -6, -26 -2, 0 -4 Z" opacity={0.18} />
        <Stroke d="M0 -16 L0 18" width={3.2} />
        <Stroke d="M0 -16 C -4 -28, -10 -34, -16 -36 M0 -16 C 4 -28, 10 -34, 16 -36" />
        <Dot x={-16} y={-36} />
        <Dot x={16} y={-36} />
      </g>
    </>
  );
}

function FlowerVine() {
  return (
    <>
      <Stroke d="M104 294 C 96 246, 126 212, 104 168 C 88 136, 116 112, 102 82" width={2.4} />
      <Stroke d="M108 200 C 86 196, 70 186, 58 168" />
      {[
        [100, 276, -60],
        [108, 258, 60],
        [112, 230, -55],
        [96, 214, 58],
        [106, 150, -60],
        [94, 128, 55],
        [108, 108, -52],
        [74, 186, 30],
        [64, 176, -80],
      ].map(([x, y, a]) => (
        <Leaf key={`${x}-${y}`} x={x} y={y} angle={a} len={17} w={6} filled />
      ))}
      <Flower x={102} y={68} s={34} count={5} rotate={-8} />
      <Flower x={56} y={160} s={22} count={5} rotate={20} />
      <Bud x={128} y={186} angle={30} />
      <Stroke d="M110 190 C 118 188, 124 186, 128 186" />
    </>
  );
}

function Deer() {
  return (
    <>
      {/* Antlers with small leaves */}
      <Stroke d="M104 84 C 100 64, 90 50, 84 30 M96 58 C 86 54, 78 48, 74 38 M89 44 C 94 36, 96 30, 94 20" />
      <Stroke d="M118 84 C 124 64, 134 50, 142 30 M128 58 C 138 54, 146 48, 150 38 M136 44 C 132 36, 130 30, 134 20" />
      <Leaf x={80} y={46} angle={-70} len={12} w={5} filled />
      <Leaf x={92} y={26} angle={-20} len={12} w={5} filled />
      <Leaf x={146} y={44} angle={70} len={12} w={5} filled />
      <Leaf x={136} y={24} angle={24} len={12} w={5} filled />
      <Flower x={111} y={80} s={7} count={6} veins={false} />
      {/* Ears */}
      <Stroke d="M100 88 C 88 82, 76 82, 68 86 C 78 94, 90 96, 100 94" />
      <Stroke d="M122 88 C 134 80, 146 80, 152 84 C 144 92, 132 96, 122 96" />
      {/* Head, muzzle and neck */}
      <Stroke d="M104 92 C 96 104, 90 118, 84 132 C 80 142, 80 150, 86 152 C 92 154, 98 150, 102 144 C 108 136, 114 130, 120 120 C 124 110, 124 100, 120 92" width={2.2} />
      <Stroke d="M84 146 C 88 144, 92 146, 94 150" />
      <Stroke d="M100 112 C 104 108, 110 108, 112 112 C 108 115, 104 115, 100 112 Z" />
      <Fill d="M100 112 C 104 108, 110 108, 112 112 C 108 115, 104 115, 100 112 Z" />
      <Stroke d="M104 146 C 106 166, 102 182, 94 198" />
      <Stroke d="M120 118 C 128 140, 132 166, 138 192" />
      {[
        [116, 160],
        [124, 172],
        [112, 178],
        [122, 186],
      ].map(([x, y]) => (
        <Dot key={`${x}-${y}`} x={x} y={y} r={2.2} />
      ))}
      {/* The flowering branch under the neck */}
      <Stroke d="M30 214 C 70 192, 120 190, 176 204" width={2.2} />
      {[
        [48, 205, -40],
        [70, 198, 50],
        [96, 194, -45],
        [148, 198, 48],
        [166, 202, -40],
      ].map(([x, y, a]) => (
        <Leaf key={`${x}-${y}`} x={x} y={y} angle={a} len={15} w={6} />
      ))}
      <Flower x={124} y={196} s={14} count={6} />
    </>
  );
}

function RoseStars() {
  // A scalloped outline of outer petals, then the folded petals inside, then a soft fill.
  const head = "M78 100 C 72 86, 82 74, 94 76 C 98 66, 114 66, 118 76 C 130 76, 136 90, 128 100 C 132 112, 120 124, 106 120 C 98 128, 82 122, 82 112 C 76 110, 74 104, 78 100 Z";
  return (
    <>
      <Stroke d={head} width={2.2} />
      <Stroke d="M88 104 C 84 92, 92 84, 102 86 C 110 82, 120 88, 118 98" />
      <Stroke d="M92 110 C 100 116, 112 114, 120 104" />
      <Stroke d="M96 100 C 94 92, 104 90, 108 94 C 112 98, 108 104, 102 103 C 98 102, 98 98, 101 97" />
      <Stroke d="M94 78 C 100 84, 106 84, 112 78" />
      <Fill d={head} opacity={0.32} />
      <Stroke d="M90 122 C 94 128, 100 130, 106 126 M110 122 C 114 126, 116 130, 114 134" />
      <Stroke d="M102 124 C 104 164, 96 200, 106 246" width={2.2} />
      <Stroke d="M101 176 C 88 166, 74 166, 64 172 C 74 182, 88 184, 101 176 Z M101 176 C 88 174, 76 172, 66 172" />
      <Stroke d="M102 200 C 116 188, 132 188, 140 194 C 130 204, 116 206, 102 200 Z M102 200 C 116 196, 128 194, 138 194" />
      <Sparkle x={150} y={70} s={14} />
      <Sparkle x={172} y={96} s={8} />
      <Sparkle x={140} y={104} s={7} />
      <Sparkle x={158} y={126} s={9} />
      <Sparkle x={182} y={60} s={6} />
      <Dot x={168} y={80} />
      <Dot x={150} y={92} r={1.6} />
      <Dot x={176} y={118} r={1.6} />
    </>
  );
}

function Horse() {
  return (
    <>
      {/* Ears */}
      <Stroke d="M112 52 L118 24 L126 54" />
      <Stroke d="M124 54 L136 30 L138 60" />
      {/* Face down to the muzzle */}
      <Stroke d="M114 56 C 98 70, 84 92, 70 116 C 62 130, 58 142, 62 150 C 66 158, 78 158, 86 152" width={2.2} />
      <Stroke d="M66 138 C 68 134, 72 134, 74 138" />
      <Stroke d="M64 150 C 70 148, 78 148, 84 150" />
      {/* Cheek, jaw and neck */}
      <Stroke d="M86 152 C 98 146, 108 134, 110 118 C 112 106, 120 96, 132 92" />
      <Stroke d="M100 144 C 104 176, 98 210, 88 246" width={2.2} />
      <Stroke d="M104 82 C 108 78, 114 78, 117 82 C 113 85, 108 85, 104 82 Z" />
      <Fill d="M104 82 C 108 78, 114 78, 117 82 C 113 85, 108 85, 104 82 Z" />
      <Stroke d="M80 120 C 88 112, 96 108, 104 108" />
      {/* The flowing mane, with small leaves woven in */}
      <Stroke d="M134 58 C 150 80, 146 118, 158 154 C 166 182, 156 212, 166 246" />
      <Stroke d="M128 62 C 138 92, 130 128, 142 166 C 150 194, 140 220, 148 244" />
      <Stroke d="M142 60 C 162 84, 166 118, 180 146 C 188 164, 186 186, 192 204" />
      <Stroke d="M122 70 C 128 100, 120 132, 126 168 C 130 194, 122 214, 124 236" />
      {[
        [150, 104, 40],
        [140, 140, -40],
        [170, 132, 50],
        [158, 180, 36],
        [130, 196, -36],
        [182, 176, 60],
      ].map(([x, y, a]) => (
        <Leaf key={`${x}-${y}`} x={x} y={y} angle={a} len={13} w={5} filled />
      ))}
    </>
  );
}

const MOTIFS: { id: string; label: string; viewBox: string; art: ReactNode }[] = [
  { id: "butterfly", label: "فراشة على غصن", viewBox: "30 0 160 300", art: <ButterflyVine /> },
  { id: "vine", label: "ورود على غصن", viewBox: "20 20 160 280", art: <FlowerVine /> },
  { id: "deer", label: "غزال بقرون مورّقة", viewBox: "20 10 170 220", art: <Deer /> },
  { id: "rose", label: "وردة ونجوم", viewBox: "50 40 145 220", art: <RoseStars /> },
  { id: "horse", label: "رأس حصان", viewBox: "40 10 165 245", art: <Horse /> },
];

/* ---------- One shuffle per visit ---------- */

const SERVER_ORDER = MOTIFS.map((_, i) => i);
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

/** Total time to draw one picture, whatever its number of strokes. */
const DRAW_SECONDS = 3.4;

/**
 * Give every stroke, fill and dot its start time from its place in the drawing, once the
 * drawing is on the page. Keeping this out of render keeps server and browser markup identical.
 */
function stagger(svg: SVGSVGElement | null) {
  if (!svg) return;
  const parts = svg.querySelectorAll<SVGElement>("[data-stroke], [data-fill], [data-dot]");
  const step = DRAW_SECONDS / Math.max(parts.length, 1);
  parts.forEach((el, i) => el.style.setProperty("--d", `${(i * step).toFixed(3)}s`));
}

/**
 * A drawing for one place on the page. Places use slots 0–4; within one visit every slot shows
 * a different drawing, and the whole set changes on the next visit.
 */
export function Motif({ slot, className = "", strokeWidth = 1.8 }: { slot: number; className?: string; strokeWidth?: number }) {
  const order = useSyncExternalStore(noSubscribe, shuffledOrder, () => SERVER_ORDER);
  const motif = MOTIFS[order[slot % MOTIFS.length]];
  return (
    <svg
      key={motif.id}
      ref={stagger}
      viewBox={motif.viewBox}
      role="img"
      aria-label={`رسمة حنة: ${motif.label}`}
      className={`draw ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ "--draw-dur": "1.5s" } as CSSProperties}
    >
      {motif.art}
    </svg>
  );
}
