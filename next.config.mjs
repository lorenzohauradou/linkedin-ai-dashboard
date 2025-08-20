/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Aumentato per video più grandi
    },
  },
  // Configurazione per API routes in Next.js 15
  serverRuntimeConfig: {
    maxRequestSize: '50mb',
  },
}

export default nextConfig
