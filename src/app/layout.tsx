import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClareMesh — Clarity through connection",
  description:
    "An open-source financial data schema and bi-directional sync SDK that runs on your own infrastructure.",
  keywords: "financial data, normalization, bi-directional sync, plaid, quickbooks, stripe, fintech infrastructure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FAFAF8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
