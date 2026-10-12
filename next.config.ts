import type { NextConfig } from "next";

// Photos are served from the Supabase project's public storage.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabase ? [{ protocol: "https", hostname: supabase.hostname, pathname: "/storage/v1/object/public/**" }] : [],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  turbopack: { root: __dirname },
};

export default nextConfig;
