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
      // /writings became /posts and /work became /projects (2026-09). Project
      // detail pages live under /posts; /posts/<slug> redirects to
      // /posts/<collection>/<slug> for posts inside a collection.
      {
        source: "/writings/:path*",
        destination: "/posts/:path*",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/work/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/writings/:path*",
        destination: "/ja/posts/:path*",
        permanent: true,
      },
      {
        source: "/ja/work",
        destination: "/ja/projects",
        permanent: true,
      },
      {
        source: "/ja/work/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      // Old /portfolio section (retired 2026-09 in favour of /gallery +
      // case studies folded into /posts). Specific slugs first, then a
      // catch-all so any stray link still lands somewhere useful.
      {
        source: "/portfolio/artworks",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/portfolio/projects",
        destination: "/projects",
        permanent: true,
      },
      // content-creator and gold-hunt are archived (their pages 404), so
      // they land on the Gallery index instead.
      {
        source: "/portfolio/artisanship",
        destination: "/gallery/artisanship",
        permanent: true,
      },
      {
        source: "/portfolio/content-creator",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/portfolio/gold-hunt",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/portfolio/treasure-and-pleasure",
        destination: "/gallery/treasure-and-pleasure",
        permanent: true,
      },
      {
        source: "/portfolio/austride",
        destination: "/posts/AuStride/austride-overview",
        permanent: true,
      },
      {
        source: "/portfolio/lingobun",
        destination: "/posts/LingoBun/lingobun-overview",
        permanent: true,
      },
      // These three were "coming soon" placeholders and are now draft (see
      // Phase 3 of the AI-repositioning roadmap) — their specific slugs no
      // longer resolve, so send visitors to the Projects index instead.
      {
        source: "/portfolio/case-study-3",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/gonow-design-ops",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/wamazing",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/:slug",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/projects",
        permanent: true,
      },
      // JA mirror has no translated portfolio content, so send everything
      // to the JA Projects index.
      {
        source: "/ja/portfolio/:path*",
        destination: "/ja/projects",
        permanent: true,
      },
      {
        source: "/ja/portfolio",
        destination: "/ja/projects",
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
