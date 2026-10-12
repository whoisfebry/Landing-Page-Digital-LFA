import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "SKK Migas | Digital LFA",
    description:
        "Program Pengembangan Masyarakat yang tercatat dari rencana sampai hasil.",
    icons: {
        icon: "/images/logo1.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body
                suppressHydrationWarning
                className={`${spaceGrotesk.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}