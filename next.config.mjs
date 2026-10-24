/** @type {import('next').NextConfig} */
// Audit P3-16: bundle analyzer for build-time inspection
import bundleAnalyzer from "@next/bundle-analyzer"

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v0.blob.com",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // optimizeCss disabled to avoid production CSS loading issues
  },
  // Audit P2-13: critical CSS extraction config
  // Handle static files and avoid redirect loops
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:locale/:path*',
          has: [
            {
              type: 'header',
              key: 'x-skip-locale-redirect',
              value: 'true',
            },
          ],
          destination: '/:path*',
        },
      ],
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  }
}

export default bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig)
