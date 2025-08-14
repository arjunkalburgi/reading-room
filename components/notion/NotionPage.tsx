'use client';

import dynamic from 'next/dynamic';
import { NotionRenderer } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css';
import './NotionPage.css';
import type { PostMeta } from "@/components/notion/types";
import { formatDate } from "@/components/utls";

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
    return (
        <div className="post-container">
            <small>{meta.readingMinutes} min read</small>
            <h1>{meta.title}</h1>
            <small>by <a href="https://arjunkalburgi.com">Arjun Kalburgi</a> on {formatDate(meta.date)}</small>
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
        </div>
    );
}
