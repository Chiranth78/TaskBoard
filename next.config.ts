
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export
  images: {
    unoptimized: true, // Disable server-dependent image optimization for export
  },
  trailingSlash: true, // Optional: ensures every route works as a standalone .html file
};

module.exports = nextConfig;
