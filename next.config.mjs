/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.optimization.splitChunks = {
            chunks: 'all',
            maxSize: 244 * 1024, // 244 KiB
        };
        return config;
    },
};

export default nextConfig;
