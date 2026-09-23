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
        destination: "/work",
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
        destination: "/work/austride-overview",
        permanent: true,
      },
      {
        source: "/portfolio/lingobun",
        destination: "/work/lingobun-overview",
        permanent: true,
      },
      // These three were "coming soon" placeholders and are now draft (see
      // Phase 3 of the AI-repositioning roadmap) — their specific slugs no
      // longer resolve, so send visitors to the Work index instead.
      {
        source: "/portfolio/case-study-3",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/portfolio/gonow-design-ops",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/portfolio/wamazing",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/portfolio/:slug",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/work",
        permanent: true,
      },
      // JA mirror has no translated portfolio content, so send everything
      // to the JA Work index.
      {
        source: "/ja/portfolio/:path*",
        destination: "/ja/work",
        permanent: true,
      },
      {
        source: "/ja/portfolio",
        destination: "/ja/work",
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
