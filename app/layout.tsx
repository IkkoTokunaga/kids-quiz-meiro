import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kids-quiz.ikk-dev.jp"),
  title: "せいかつマナー めいろ",
  description: "こども向け せいかつマナー 4せんたく クイズ",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "せいかつマナー めいろ",
    description: "こども向け せいかつマナー 4せんたく クイズ",
    url: "/",
    siteName: "せいかつマナー めいろ",
    images: [
      {
        url: "/og-image.png",
        width: 675,
        height: 518,
        alt: "せいかつマナー めいろのクイズ画面",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "せいかつマナー めいろ",
    description: "こども向け せいかつマナー 4せんたく クイズ",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#7dd3fc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-sky-300">{children}</body>
    </html>
  );
}
