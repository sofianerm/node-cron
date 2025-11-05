/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // PDF.js worker configuration
    config.resolve.alias.canvas = false;
    return config;
  },
}

module.exports = nextConfig
