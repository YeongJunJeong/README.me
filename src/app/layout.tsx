import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "README.me — Your GitHub Wrapped",
  description:
    "Spotify Wrapped, but for your GitHub. Analyze your coding personality and share your developer card.",
  openGraph: {
    title: "README.me — Your GitHub Wrapped",
    description:
      "Spotify Wrapped, but for your GitHub. Analyze your coding personality and share your developer card.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "README.me — Your GitHub Wrapped",
    description:
      "Spotify Wrapped, but for your GitHub. Analyze your coding personality and share your developer card.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
