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
