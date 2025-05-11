import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: 'Your Website',
  description: 'Personal blog and project portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
