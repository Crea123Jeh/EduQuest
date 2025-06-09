
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export as default loader needs a server
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // If deploying to a path like username.github.io/your-repo-name
  // You might need to set basePath:
  // basePath: '/your-repo-name',
  // And assetPrefix:
  // assetPrefix: '/your-repo-name/',
};

export default nextConfig;
