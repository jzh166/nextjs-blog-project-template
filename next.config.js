/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zhangj.ing',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
