/** Small line and brand icons, sized by the parent's font size via 1em. */
type P = { className?: string };
const base = "size-[1.15em] shrink-0";

export const WhatsAppIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.15-1.35A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.8.82-2.98-.2-.31a8.22 8.22 0 1 1 6.92 3.82Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.79 2.79 0 0 0-.87 2.07 4.83 4.83 0 0 0 1.02 2.57 11.07 11.07 0 0 0 4.24 3.74c1.58.68 2.2.74 2.99.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const InstagramIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </svg>
);

export const FacebookIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="currentColor">
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20 20 0 0 0 14.3 4.3c-2.24 0-3.77 1.37-3.77 3.88v2.32H8v3h2.53V21h2.97Z" />
  </svg>
);

export const TikTokIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="currentColor">
    <path d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3a7.3 7.3 0 0 1-3.8-1.2v6.2a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.07v3.1a2.8 2.8 0 1 0 2 2.67V3h2.8Z" />
  </svg>
);

export const ThreadsIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M16.6 11.3c-.5-2.4-2.3-3.6-4.6-3.6-2.8 0-4.4 2-4.4 4.4s1.6 4.6 4.5 4.6c2.4 0 3.8-1.4 3.8-3.1 0-2.3-2.8-2.8-4.7-2.3-1.3.3-2 1.2-1.8 2.2.3 1.5 2.6 1.7 3.6.6.9-1 1.2-2.7 1.1-4.3" />
    <path d="M19.5 7.5A8.5 8.5 0 1 0 20.5 12" />
  </svg>
);

export const YouTubeIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="currentColor">
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

export const PinIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const HomeIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />
  </svg>
);

export const CheckIcon = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
