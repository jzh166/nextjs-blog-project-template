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
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: 'https://zhangj.ing/wp-content/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
