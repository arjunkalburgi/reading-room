import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

/** @type {import('next').NextConfig} */
export default (phase: string) => {
    const dev = phase === PHASE_DEVELOPMENT_SERVER;
    const base = dev ? '' : '/reading-room';
    
    return {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true }, // needed for static export
        basePath: base || undefined,   // Next.js ignores empty string
        assetPrefix: base || undefined,
    };
};
