import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DataProvider } from "@/app/DataContext";  // Import DataProvider

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "AppInsights - AI-Powered App Review Analysis",
    description: "Unlock critical insights from app reviews with AppInsights. Analyze competitor reviews, detect sentiments, and track trends in real-time.",
    openGraph: {
        title: "AppInsights - AI-Powered App Review Analysis",
        description: "Unlock critical insights from app reviews with AppInsights. Analyze competitor reviews, detect sentiments, and track trends in real-time.",
        url: "https://app-insights-website.vercel.app",  // AppInsights production domain
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "AppInsights - AI-Powered App Review Analysis",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AppInsights - AI-Powered App Review Analysis",
        description: "Analyze app reviews instantly and gain deep insights into competitor apps with AppInsights.",
        images: ["/og-image.png"],
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* Additional meta tags can go here if needed */}<title>AppInsights - AI-Powered App Review Analysis</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DataProvider> {/* Wrap the children in DataProvider */}
            {children}
        </DataProvider>
        </body>
        </html>
    );
}
