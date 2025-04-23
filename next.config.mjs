/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '400mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.nomapos.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/shots",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
