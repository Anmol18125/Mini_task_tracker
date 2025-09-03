import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Task Tracker",
  description: "Next.js + Node in-memory task tracker"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
