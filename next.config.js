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
      // The generic AI/design/security/devops collection folders were split
      // into topic series (2026-09). /posts/<slug> redirects a post to its
      // current collection (or serves it, if it's now standalone), so old
      // post URLs go there; old collection index pages go to the series list.
      {
        source: "/posts/:collection(AI|design|security|devops)/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/posts/:collection(AI|design|security|devops|ml-techniques)",
        destination: "/posts/series",
        permanent: true,
      },
      {
        source: "/posts/ux-case-studies",
        destination: "/posts/radio-buttons",
        permanent: true,
      },
      {
        source: "/ja/posts/:collection(AI|design|security|devops)/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/:collection(AI|design|security|devops|ml-techniques)",
        destination: "/ja/posts/series",
        permanent: true,
      },
      {
        source: "/ja/posts/ux-case-studies",
        destination: "/ja/posts/radio-buttons",
        permanent: true,
      },
      // Old /portfolio section (retired 2026-09; case studies folded into
      // /posts). Specific slugs first, then a catch-all.
      {
        source: "/portfolio/projects",
        destination: "/projects",
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
      // These three were "coming soon" placeholders, unpublished until written
      // up — their specific slugs no longer resolve, so send visitors to the
      // Projects index instead.
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
