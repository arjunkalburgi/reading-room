import fs from 'node:fs';
import path from 'node:path';
import NotionPost from '@/components/NotionPost';
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
    const file = path.join(process.cwd(), 'data', 'posts', `${slug}.json`);
    const recordMap: ExtendedRecordMap = JSON.parse(fs.readFileSync(file, 'utf8'));
    return <NotionPost recordMap={recordMap} />;
}
