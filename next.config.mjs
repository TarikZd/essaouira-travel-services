
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  experimental: {
    optimizeCss: true,
    swcMinify: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        framework: {
          chunks: 'all',
          name: 'website',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|@next|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
