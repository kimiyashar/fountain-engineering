/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('canvas', 'bufferutil', 'utf-8-validate');
    return config;
  },
};

module.exports = nextConfig;
