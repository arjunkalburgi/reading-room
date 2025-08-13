import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => {
    const dev = phase === PHASE_DEVELOPMENT_SERVER;
    const base = dev ? '' : '/reading-room';
    
    return {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: base || undefined,
        assetPrefix: base || undefined,
    };
};

export default nextConfig;
