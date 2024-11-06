/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://app-insights-535693938808.europe-west3.run.app/:path*',
            },
        ];
    },
    images: {
        domains: ['play-lh.googleusercontent.com'],
    },
};

export default nextConfig;
