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
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/landing/program-rozwojowy-dziergania-na-drutach',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;