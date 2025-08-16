/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // updated option
  serverExternalPackages: ['nodemailer'],
};

export default nextConfig;
