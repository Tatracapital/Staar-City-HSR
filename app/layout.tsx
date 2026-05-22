import type { Metadata } from "next";
import "../src/styles.css";
import Providers from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://staar-city.com";
const siteName = "TATRA STAR CITY";
const siteDescription =
  "TATRA STAR CITY by TATRA Capital — a premium plotted township between two lakes. Strategic location, modern infrastructure, and future-ready investment for elevated living.";
const brandColor = "#b8893a";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TATRA STAR CITY — Where Vision Meets Value | TATRA Capital",
    template: "%s | TATRA STAR CITY",
  },
  description: siteDescription,
  keywords: [
    "luxury plotted development",
    "township HSR layout Bangalore",
    "premium residential investment",
    "gated community",
    "lakeside township",
    "TATRA Capital",
    "real estate",
    "affordable luxury",
  ],
  authors: [{ name: "TATRA Capital", url: siteUrl }],
  creator: "TATRA Capital",
  publisher: "TATRA Capital",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": `${siteUrl}/en`,
      "en-IN": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: siteName,
    title: "TATRA STAR CITY — Where Vision Meets Value",
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TATRA STAR CITY - Premium Township",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/og-image-square.jpg`,
        width: 800,
        height: 800,
        alt: "TATRA STAR CITY Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TATRA STAR CITY — Where Vision Meets Value",
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@TATRACapital",
    site: "@TATRACapital",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "TATRA Capital",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: siteDescription,
    sameAs: [
      "https://www.facebook.com/TATRACapital",
      "https://www.instagram.com/TATRACapital",
      "https://www.linkedin.com/company/tatra-capital",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      telephone: "+91-98000-00000",
      email: "info@tatracapital.com",
      areaServed: "IN",
      availableLanguage: ["en"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Additional Meta Tags for Semantic Web & LLM Optimization */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content={brandColor} />
        <meta name="color-scheme" content="light dark" />
        
        {/* Search Engine Optimization */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        
        {/* Open Search */}
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
        
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional Schema.org for LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: siteName,
              image: `${siteUrl}/og-image.jpg`,
              description: siteDescription,
              url: siteUrl,
              telephone: "+91-98000-00000",
              email: "info@tatracapital.com",
              sameAs: [
                "https://www.facebook.com/TATRACapital",
                "https://www.instagram.com/TATRACapital",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                postalCode: "560100",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.0827",
                longitude: "77.6063",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
