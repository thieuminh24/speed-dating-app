import type { Metadata } from "next";
import { Geist_Mono, Quicksand } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Speed Dating App 💘",
  description: "Find your perfect match with style ✨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { isReady } = useAuthInit();

  // if (!isReady) return <Loading />;
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for Story */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:ital,wght@0,400;0,700;1,400&family=Pacifico&family=Dancing+Script:wght@400;700&family=Bebas+Neue&family=Lobster&family=Righteous&family=Caveat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${quicksand.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
