import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        // Здесь можно добавить псевдонимы для Turbopack, если они понадобятся
      }
    }
  }
}

export default nextConfig;
