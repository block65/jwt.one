const nextImages = require('next-images');

const nextConfig = {
  future: {
    excludeDefaultMomentLocales: true,
    strictPostcssConfiguration: true,
    webpack5: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    optimizeFonts: true,
  },

  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV !== 'development'
                ? `default-src 'self';`
                : `default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'`,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-max-age=31557600',
          },
        ],
      },
    ];
  },
};

module.exports = nextImages({
  ...nextConfig,
  inlineImageLimit: false,
});
