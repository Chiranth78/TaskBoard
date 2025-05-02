// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export
  images: {
    unoptimized: true, // Optional: disables image optimization which is server-dependent
  },
  trailingSlash: true, // Optional: ensures every route works as a standalone .html file
};

module.exports = nextConfig;



