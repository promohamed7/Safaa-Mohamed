import type { CSSProperties, ReactNode } from "react";
import { Vine } from "./Ornaments";

type Tone = "plain" | "tinted" | "blush";

const TONES: Record<Tone, string> = { plain: "", tinted: "bg-paper-2", blush: "bg-blush/60" };

/** A page section with a centred heading: a handwritten note, the title, and a vine drawn under it. */
export function Section({ id, eyebrow, script, title, intro, children, tone = "plain" }: { id: string; eyebrow?: string; script?: string; title: string; intro?: string; children: ReactNode; tone?: Tone }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 md:py-28 ${TONES[tone]}`}>
      <div className="shell">
        <header className="mx-auto mb-12 grid max-w-2xl justify-items-center gap-3 text-center md:mb-16">
          {eyebrow && <span className="eyebrow reveal">{eyebrow}</span>}
          {script && <p className="script reveal text-[26px] md:text-[30px]" style={{ "--d": "60ms" } as CSSProperties}>{script}</p>}
          <h2 id={`${id}-title`} className="display reveal text-[34px] text-ink md:text-[48px]" style={{ "--d": "120ms" } as CSSProperties}>
            {title}
          </h2>
          <Vine className="w-40 text-sage" />
          {intro && <p className="reveal text-[16px] text-ink-2 md:text-[17px]" style={{ "--d": "180ms" } as CSSProperties}>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
