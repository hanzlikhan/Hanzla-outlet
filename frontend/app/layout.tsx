import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hanzla Outlet | Premium Pakistani Fashion & Lifestyle",
  description:
    "Discover the finest Pakistani fashion — luxury clothing, watches, accessories & more. Shop premium menswear, womenswear, and ethnic collections at Hanzla Outlet.",
  keywords: [
    "Pakistani fashion",
    "luxury clothing",
    "Hanzla Outlet",
    "premium fashion",
    "ethnic wear",
    "watches",
    "menswear",
    "womenswear",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
