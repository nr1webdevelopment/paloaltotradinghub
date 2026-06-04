/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Add patterns here if you host images on Supabase storage or elsewhere.
    ],
  },
};

module.exports = nextConfig;
