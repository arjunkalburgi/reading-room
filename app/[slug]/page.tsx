import fs from "node:fs";
import path from "node:path";
import dynamic from "next/dynamic";
import { NotionRenderer } from "react-notion-x";

const Code = dynamic(() =>
    import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
    import("react-notion-x/build/third-party/collection").then((m) => m.Collection)
);
const Equation = dynamic(() =>
    import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
    () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
    { ssr: false }
);
const Modal = dynamic(
    () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
    { ssr: false }
);

type Params = { params: { slug: string } };

export async function generateStaticParams() {
    const idxPath = path.join(process.cwd(), "data", "index.json");
    const posts = JSON.parse(fs.readFileSync(idxPath, "utf8"));
    return posts.map((p: any) => ({ slug: p.slug }));
}

export default function PostPage({ params }: Params) {
    const file = path.join(
        process.cwd(),
        "data",
        "posts",
        `${params.slug}.json`
    );
    const recordMap = JSON.parse(fs.readFileSync(file, "utf8"));
    
    return (
        <NotionRenderer
            recordMap={recordMap}
            fullPage={false}
            darkMode={false}
            components={{ Code, Collection, Equation, Pdf, Modal }}
        />
    );
}
