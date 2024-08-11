/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nomapos.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '**',
          },
        ],
      },
      async redirects() {
        return [
          {
            source: '/',
            destination: '/shots',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
