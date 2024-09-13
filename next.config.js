const nextConfig = {
  // i18n,
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_HOST],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_HOST,
        port: '8001',
        pathname: '/images/**',
      },
    ],
  },
  compress: true,
  env: {
    BASE_MEDIA_URL: process.env.NEXT_PUBLIC_MEDIA_URL,
    BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
    X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY,
    USER_TOKEN_KEY: process.env.NEXT_PUBLIC_USER_TOKEN_KEY,
    // GUEST_TOKEN_KEY: process.env.NEXT_PUBLIC_GUEST_TOKEN_KEY,
    // ANALYTICS_WRITE_KEY: process.env.ANALYTICS_WRITE_KEY,
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  productionBrowserSourceMaps: true,
  future: {
    strictPostcssConfiguration: true,
  },
  async headers() {
    return [
      {
        // This works, and returns appropriate Response headers:
        source: '/:all*(svg|jpg|png|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000, must-revalidate',
          },
        ],
      },
      {
        // This doesn't work for 'Cache-Control' key (works for others though):
        source: '/_next/image(.*)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
