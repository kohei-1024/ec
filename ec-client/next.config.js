/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のlintを無視する
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost', 'placehold.it', 'via.placeholder.com', 'placehold.co'],
    // unoptimized: true,
  },
  // output: "export", // 静的エクスポートする
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
