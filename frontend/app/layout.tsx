import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToDo",
  description: "A basic ToDo app built with Django and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={hankenGrotesk.className}>{children}</body>
    </html>
  );
}
