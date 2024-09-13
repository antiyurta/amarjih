yayarmodule.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/_next',
    '/404',
    '/blank',
    '/auth/login',
    '/auth/password-recovery',
    '/redirect',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: 'Twitterbot',
        disallow: '',
      },
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/_next',
          '/404',
          '/blank',
          '/auth/login',
          '/auth/password-recovery',
          '/redirect',
        ],
      },
    ],
  },
};
