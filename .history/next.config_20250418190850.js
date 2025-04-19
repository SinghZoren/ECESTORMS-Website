/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    // Allow unoptimized images for the image cropper
    unoptimized: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Don't fail the build on eslint warnings in production
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 