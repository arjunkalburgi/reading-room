"use client";

import "./layout.css";
import { useEffect, useState } from "react";
import { animate } from "@arjunanimations/leaves";

export const metadata = {
    title: "Arjun's Reading Room",
    description: "Thoughts, projects and writing from me, Arjun Kalburgi.",
    icons: {
        icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    }
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const [isIOS, setIsIOS] = useState(false);
    const [prefersReduced, setPrefersReduced] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);
    
    useEffect(() => {
        const mReduce = matchMedia("(prefers-reduced-motion: reduce)");
        const mSmall = matchMedia("(max-width: 480px)");
        
        setPrefersReduced(mReduce.matches);
        setSmallScreen(mSmall.matches);
        setIsIOS(/iPhone|iPod|iPad/i.test(navigator.userAgent || navigator.vendor));
        
        const onReduce = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        const onSmall = (e: MediaQueryListEvent) => setSmallScreen(e.matches);
        mReduce.addEventListener("change", onReduce);
        mSmall.addEventListener("change", onSmall);
        
        let stop: (() => void) | null = null;
        const shouldAnimate = !isIOS && !prefersReduced;
        if (shouldAnimate) {
            stop = animate({
                className: "footer-bg",
                numOfSprites: smallScreen ? 7 : 12,
                pathsOfSprites: ["/cloud/pink.PNG", "/cloud/orange.PNG", "/cloud/blue.PNG"],
                noRotation: true,
                noSway: prefersReduced,
                noSpin: prefersReduced,
                width: 1000,
                height: 1000,
            });
        }
        
        return () => {
            mReduce.removeEventListener("change", onReduce);
            mSmall.removeEventListener("change", onSmall);
            if (stop) stop();
        };
    }, [isIOS, prefersReduced, smallScreen]);

    return (
        <div className="layout">
            <header className="site-header">
                <a href="https://arjunkalburgi.com" aria-label="Writing homepage">
                    <h1 className="logo">
                        <img src="/logo.svg" alt="Arjun Kalburgi's icon" />
                    </h1>
                </a>
            </header>

            {children}
            
            <footer className="site-footer">
                {isIOS ? (
                    <div className="clouds" aria-hidden="true">
                        <img src="/cloud/blue.PNG" alt="blue cloud" />
                        <img src="/cloud/pink.PNG" alt="pink cloud" />
                        <img src="/cloud/orange.PNG" alt="orange cloud" />
                    </div>
                ) : (
                    <div className="footer-bg" aria-hidden="true" />
                )}

                <div className="footer-content">
                    <h2>Feeling inspired?</h2>
                    <p>I'm always excited to meet thoughtful folks and life enjoyers.</p>
                    <p>Building something? Facing a tough challenge? Exploring ideas? I'd love to help.</p>
                    <p>I try to meet someone new every day. Maybe that's you?</p>
                    <p>
                        Feel free to <a href="mailto:askalburgi@gmail.com">drop me a note</a> or{" "}
                        <a href="https://calendar.app.google/MbZyXQHeCAa7LtiJ6">schedule a time to chat</a>.
                    </p>
                </div>
            </footer>
        </div>
    );
}
