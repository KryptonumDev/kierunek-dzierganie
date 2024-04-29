/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/szydelkowanie',
        destination: '/kursy-szydelkowania',
        permanent: true,
      },
      {
        source: '/dzierganie-na-drutach',
        destination: '/kursy-dziergania-na-drutach',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
