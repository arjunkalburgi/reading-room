'use client';

import dynamic from 'next/dynamic';
import { NotionRenderer } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css';
import './NotionPage.css';
import type { PostMeta } from "@/components/notion/types";
import { formatDate } from "@/components/utls";
import Link from 'next/link';

const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then(m => m.Code)
);
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(m => m.Collection)
);
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then(m => m.Equation)
);
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
    { ssr: false }
);
function NullComponent() {
    return null;
}

export default function NotionPage({ recordMap, meta }: { recordMap: ExtendedRecordMap, meta: PostMeta }) {

    function createMailtoLink() {
        const subject = encodeURIComponent(`Re: ${meta.title}`);
        const body = encodeURIComponent("Hey Arjun! My name is ");
        return `mailto:askalburgi@gmail.com?subject=${subject}&body=${body}`;
    }

    return (
        <div className="post-container">
            <small><Link href="/">← More writing</Link></small>
            <h1>{meta.title}</h1>
            <small>{meta.readingMinutes} min read by <Link href="https://arjunkalburgi.com">Arjun Kalburgi</Link> on {formatDate(meta.date)}</small>
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={false}
                components={{ 
                    Code, 
                    Collection, 
                    Equation, 
                    Property: NullComponent,
                    Modal 
                }}
            />
            <p>
                I would love to keep talking about this with you.
            </p>
            <p>
                Feel free to shoot me a text, <a target="_blank" href={createMailtoLink()}>drop me a note</a> or <a target="_blank" href="https://calendar.app.google/MbZyXQHeCAa7LtiJ6">schedule a time to chat</a>.
            </p>
        </div>
    );
}
