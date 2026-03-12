import type { NextConfig } from "next";

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
    // ✅ ДОБАВЛЕНО: Оптимизация изображений
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // webpack: (config, { isServer }) => {
  //   // Добавляем псевдоним для @prisma/client
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@prisma/client': path.resolve(__dirname, './src/lib/prisma-client.ts'),
  //   };

  //   return config;
  // },
  turbopack: {
    resolveAlias: {
      // Здесь можно добавить псевдонимы для Turbopack, если они понадобятся
    }
  }
}

export default nextConfig;
