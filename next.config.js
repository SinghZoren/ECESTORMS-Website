/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
    unoptimized: true, // Enable unoptimized images for the cropper to work correctly
  },
  eslint: {
    // Don't fail the build on eslint warnings in production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail the build on TypeScript errors in production
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 