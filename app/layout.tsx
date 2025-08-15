import "./globals.css";
import SiteLayout from "@/components/sitelayout/SiteLayout";

export const metadata = {
    title: "Arjun's Reading Room",
    description: "Thoughts, projects and writing from me, Arjun Kalburgi.",
    icons: {
        icon: [{ url: "/favicon.png", sizes: "any", type: "image/png" }],
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SiteLayout>{children}</SiteLayout>
            </body>
        </html>
    );
}
