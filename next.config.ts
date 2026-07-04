import type { NextConfig } from "next";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

/** Хост бэкенда для next/image (берётся из env, без хардкода IP). */
function backendImagePatterns() {
  if (!API_ORIGIN) return [];
  try {
    const u = new URL(API_ORIGIN);
    return [{ protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname }];
  } catch {
    return [];
  }
}

const isDev = process.env.NODE_ENV === "development";

function buildSecurityHeaders() {
  // React/Next в dev используют eval() для HMR и стеков — в production eval не нужен.
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  const connectSrc = isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'";

  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        scriptSrc,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        connectSrc,
        "frame-src https://www.google.com https://maps.google.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    },
  ];

  // HSTS на localhost не нужен и может мешать при локальной разработке.
  if (!isDev) {
    headers.splice(4, 0, {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  }

  return headers;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "w7.pngwing.com" },
      { protocol: "https", hostname: "*.pngwing.com" },
      ...backendImagePatterns(),
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: buildSecurityHeaders() }];
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
