/** @type {import('next').NextConfig} */
import { redirects } from './redirects.mjs';

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
    return redirects;
  },
};

export default nextConfig;
