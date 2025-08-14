import fs from 'node:fs';
import path from 'node:path';
import NotionPage from '@/components/notion/NotionPage';
import type { PostMeta } from '@/components/notion/types';
import type { ExtendedRecordMap } from 'notion-types';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const idxPath = path.join(process.cwd(), 'data', 'index.json');
    const posts: { slug: string }[] = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage(props: PageProps) {
    const { slug } = await props.params;
    
    // Read metadata
    const idxPath = path.join(process.cwd(), "data", "index.json");
    const posts: PostMeta[] = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    const meta = posts.find((p) => p.slug === slug);
    if (!meta) throw new Error(`Post metadata not found for slug: ${slug}`);
    
    const file = path.join(process.cwd(), 'data', 'posts', `${slug}.json`);
    const recordMap: ExtendedRecordMap = JSON.parse(fs.readFileSync(file, 'utf8'));
    return <NotionPage recordMap={recordMap} meta={meta} />;
}
