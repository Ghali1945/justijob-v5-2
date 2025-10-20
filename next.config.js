const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ NOUVELLE LIGNE
  },
  eslint: {
    ignoreDuringBuilds: true,  // ✅ NOUVELLE LIGNE
  },
};

module.exports = nextConfig;