const path = require('path');

const nextConfig = {
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['cdn.sanity.io']
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing/program-rozwojowy-dziergania-na-drutach',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig