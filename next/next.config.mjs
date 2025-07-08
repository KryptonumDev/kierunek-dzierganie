/** @type {import('next').NextConfig} */
import { redirects } from './redirects.mjs';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment files
config({ path: join(process.cwd(), '.env.local') });
const appEnv = process.env.APP_ENV || 'development';
// Override with environment-specific config (force overwrite)
config({ path: join(process.cwd(), `.env.${appEnv}`), override: true });

console.log(`🔧 Next.js Config: Loading environment for ${appEnv}`);

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
