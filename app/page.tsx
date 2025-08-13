import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type PostMeta = {
    title: string;
    slug: string;
    date: string;
    tags: string[];
    summary: string;
    hero?: string | null;
    readingMinutes: number;
};

export default function Home() {
    const file = path.join(process.cwd(), "data", "index.json");
    const posts: PostMeta[] = JSON.parse(fs.readFileSync(file, "utf8"));
    
    return (
        <>
            <h1>Reading Room</h1>
            {posts.map((p) => (
                <article key={p.slug} className="card">
                    <h2>
                        <Link href={`/${p.slug}`}>{p.title}</Link>
                    </h2>
                    <p className="muted">
                        {p.date} · {p.readingMinutes} min read
                    </p>
                    <p>{p.summary}</p>
                </article>
            ))}
        </>
    );
}
