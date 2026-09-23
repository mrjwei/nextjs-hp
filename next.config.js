module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.jessewei.net",
          },
        ],
        destination: "https://jessewei.net/:path*",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
      // Old /portfolio section (retired 2026-09 in favour of /gallery +
      // case studies folded into /writings). Specific slugs first, then a
      // catch-all so any stray link still lands somewhere useful.
      {
        source: "/portfolio/artworks",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/portfolio/projects",
        destination: "/writings?tags=casestudy",
        permanent: true,
      },
      {
        source: "/portfolio/artisanship",
        destination: "/gallery/artisanship",
        permanent: true,
      },
      {
        source: "/portfolio/content-creator",
        destination: "/gallery/content-creator",
        permanent: true,
      },
      {
        source: "/portfolio/gold-hunt",
        destination: "/gallery/gold-hunt",
        permanent: true,
      },
      {
        source: "/portfolio/treasure-and-pleasure",
        destination: "/gallery/treasure-and-pleasure",
        permanent: true,
      },
      {
        source: "/portfolio/austride",
        destination: "/writings/AuStride/austride-overview",
        permanent: true,
      },
      {
        source: "/portfolio/lingobun",
        destination: "/writings/LingoBun/lingobun-overview",
        permanent: true,
      },
      {
        source: "/portfolio/case-study-3",
        destination: "/writings/case-study-3",
        permanent: true,
      },
      {
        source: "/portfolio/gonow-design-ops",
        destination: "/writings/gonow-design-ops",
        permanent: true,
      },
      {
        source: "/portfolio/wamazing",
        destination: "/writings/wamazing",
        permanent: true,
      },
      {
        source: "/portfolio/:slug",
        destination: "/writings?tags=casestudy",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/writings?tags=casestudy",
        permanent: true,
      },
      // JA mirror has no translated portfolio content, so send everything
      // to the JA case-study filter.
      {
        source: "/ja/portfolio/:path*",
        destination: "/ja/writings?tags=casestudy",
        permanent: true,
      },
      {
        source: "/ja/portfolio",
        destination: "/ja/writings?tags=casestudy",
        permanent: true,
      },
    ]
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }

    return config
  },
}
