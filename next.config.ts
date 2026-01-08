import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
    // Modern image formats for smaller bundles
    formats: ["image/avif", "image/webp"],
    // Optimize image sizing
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Experimental performance features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },

  // Reduce powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
