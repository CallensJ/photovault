import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/app/uploads/images/:path*',  // Rediriger vers le dossier app
      },
    ];
  },
};

export default nextConfig;