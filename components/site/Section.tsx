import type { CSSProperties, ReactNode } from "react";
import { Vine } from "./Ornaments";

/** A page section with a centred heading and a vine drawn under it. */
export function Section({ id, eyebrow, title, intro, children, tone = "plain" }: { id: string; eyebrow: string; title: string; intro?: string; children: ReactNode; tone?: "plain" | "tinted" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 md:py-28 ${tone === "tinted" ? "bg-paper-2" : ""}`}>
      <div className="shell">
        <header className="mx-auto mb-12 grid max-w-2xl justify-items-center gap-3 text-center md:mb-16">
          <span className="eyebrow reveal">{eyebrow}</span>
          <h2 id={`${id}-title`} className="display reveal text-[34px] md:text-[48px]" style={{ "--d": "80ms" } as CSSProperties}>
            {title}
          </h2>
          <Vine className="w-44 text-gold" />
          {intro && <p className="reveal text-[16px] text-ink-2 md:text-[17px]" style={{ "--d": "160ms" } as CSSProperties}>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
