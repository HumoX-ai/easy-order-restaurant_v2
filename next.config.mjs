/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "humox.pythonanywhere.com",
      },
    ],
  },
};

export default nextConfig;
