/** @type {import('next').NextConfig} */
const nextConfig = {
  async middleware() {
    return [
      {
        source: '/:path*', // apply to all paths
        destination: 'middleware.ts',
      },
    ];
  },
};

module.exports = nextConfig
