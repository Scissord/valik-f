import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.valik.kz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // webpack: (config, { isServer }) => {
  //   // Добавляем псевдоним для @prisma/client
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@prisma/client': path.resolve(__dirname, './src/lib/prisma-client.ts'),
  //   };

  //   return config;
  // },
  experimental: {
    turbo: {
      resolveAlias: {
        // Здесь можно добавить псевдонимы для Turbopack, если они понадобятся
      }
    }
  }
}

export default nextConfig;
