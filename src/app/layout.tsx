import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: 'zhangj.ing',
  description: 'Exploring the world, one story at a time',
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
