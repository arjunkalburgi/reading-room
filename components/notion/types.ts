export type PostMeta = {
    title: string;
    slug: string;
    date: string;
    tags: string[];
    summary: string;
    hero?: string | null;
    contentType?: string[];
    readingMinutes: number;
};