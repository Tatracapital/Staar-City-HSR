import type { Metadata } from "next";
import "../src/styles.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "TATRA STAR CITY — Where Vision Meets Value | TATRA Capital",
  description:
    "TATRA STAR CITY by TATRA Capital — a premium plotted township between two lakes. Strategic location, modern infrastructure and future-ready investment for elevated living.",
  openGraph: {
    title: "TATRA STAR CITY — Where Vision Meets Value",
    description:
      "A premium plotted development crafted for future-focused investors and elevated living.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
