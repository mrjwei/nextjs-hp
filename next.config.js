module.exports = {
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
