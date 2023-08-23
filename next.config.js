/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: { // TODO: podmienić na nowy url
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'psychodietmed.headlesshub.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
