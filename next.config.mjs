/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',   // Google user images
      'encrypted-tbn0.gstatic.com',  // Google thumbnails
      'www.google.com',               // any Google URLs
      'cdn.sanity.io',                // optional if using Sanity CMS
    ],
  },
};

export default nextConfig;
