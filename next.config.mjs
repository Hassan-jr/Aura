/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '400mb',
    },
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "r2.nomapos.com",
    //     pathname: "/**",
    //   }
    // ],
     domains: ['r2.nomapos.com'],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
