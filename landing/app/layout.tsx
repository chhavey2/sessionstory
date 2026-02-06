import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SessionStory | Watch Real User Sessions",
  description:
    "Watch real user sessions as they happen. See every click, scroll, and interaction so you can reproduce bugs and understand exactly what went wrong.",
  icons: {
    icon: "/logo2.svg",
    shortcut: "/logo2.svg",
    apple: "/logo2.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script src="https://static.sessionstory.co/index.js?id=6985d64d0fb0fa3571cafc04" />
      </body>
    </html>
  );
}
