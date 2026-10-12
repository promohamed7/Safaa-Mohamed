"use client";

import { useEffect } from "react";

/**
 * Adds .is-in to every .reveal and .draw element once it scrolls into view, so server-rendered
 * markup only needs a class. Content stays visible without JavaScript (see the noscript style in the layout).
 */
export function MotionObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const watch = (root: ParentNode) => root.querySelectorAll(".reveal:not(.is-in), .draw:not(.is-in)").forEach((el) => io.observe(el));
    watch(document);
    // Sections that render later (lightbox, client lists) get picked up too.
    const mo = new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => n instanceof Element && watch(n.parentNode ?? n))));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
