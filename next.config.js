/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Helps with hydration issues
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress hydration warnings in development for known browser extension issues
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
}

module.exports = nextConfig
