import fs from "node:fs";
import path from "node:path";
import "./page.css";
import type { PostMeta } from "@/components/notion/types";
import { formatDate } from "@/components/utls";
import Image from "next/image";

export default function Home() {
    const file = path.join(process.cwd(), "data", "index.json");
    const posts: PostMeta[] = JSON.parse(fs.readFileSync(file, "utf8"));
    
    const hero = posts.length > 0 ? posts[0] : null;
    const rest = hero ? posts.slice(1) : posts;
    
    return (
        <main className="content">
            <h2>Expressing myself</h2>
            <p>
                Creative outlets are a huge part of enjoying life, it’s how we connect with others and truly understand
                ourselves. When we share our thoughts, emotions, and creativity, it fosters a deeper sense of fulfillment and
                authenticity in everything we do.
            </p>
            <p>Check out some of the things I&apos;ve created:</p>

            <section>
                <div className="posts">
                {hero && (
                    <div className="section">
                        <a className="post" href={`/${hero.slug}`}>
                            <div className="post-art blog---featured-post---image">
                                {hero.hero ? (
                                    <Image src={hero.hero} alt={hero.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div className="no-art" aria-hidden="true" />
                                )}
                                {hero.contentType ? (
                                    <span>{hero.contentType.join(", ")}</span>
                                ) : (<></>)}
                            </div>
                            <h4>{hero.title}</h4>
                            <p>{hero.summary}</p>
                            <p>
                                <small>{formatDate(hero.date)}</small>
                            </p>
                        </a>
                    </div>
                )}

                {rest.map((post) => (
                    <div key={post.slug} className="section">
                        <a className="post" href={`/${post.slug}`}>
                            <div className="post-art">
                                {post.hero ? (
                                    <Image src={post.hero} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div className="no-art" aria-hidden="true" />
                                )}
                                {post.contentType ? (
                                    <span>{post.contentType.join(", ")}</span>
                                ) : (<></>)}
                            </div>
                            <h4>{post.title}</h4>
                            <p>{post.summary}</p>
                            <p>
                                <small>{formatDate(post.date)}</small>
                            </p>
                        </a>
                    </div>
                ))}
                </div>

                <div className="section">
                    <div className="bg-hint" aria-hidden="true"></div>
                    <div>
                        <h3>What’s new</h3>
                        <p>
                            Fresh posts land here as you add content. Reactions and presence will slide in later.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
