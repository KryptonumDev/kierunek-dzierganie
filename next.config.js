const path = require('path');

const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'psychodietmed.headlesshub.com',
  //       port: '',
  //       pathname: '/wp-content/uploads/**',
  //     },
  //   ],
  // },
}

module.exports = nextConfig
