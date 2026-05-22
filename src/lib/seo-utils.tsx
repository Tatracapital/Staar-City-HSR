import { ReactNode } from "react";

/**
 * Breadcrumb Schema for SEO
 * Helps search engines understand page hierarchy
 */
export const BreadcrumbSchema = ({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Article Schema for Blog Posts / Content
 */
export const ArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Property Schema for Real Estate
 */
export const PropertySchema = ({
  name,
  description,
  image,
  price,
  currency,
  address,
  latitude,
  longitude,
}: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    description,
    image,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: price,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * FAQ Schema for Rich Results
 */
export const FAQSchema = ({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Semantic HTML Helpers
 */
export const SEMeta = {
  h1: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h1 className={`text-4xl font-bold ${className}`}>{children}</h1>
  ),
  h2: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h2 className={`text-3xl font-bold ${className}`}>{children}</h2>
  ),
  h3: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h3 className={`text-2xl font-bold ${className}`}>{children}</h3>
  ),
  section: ({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) => (
    <section id={id} className={className}>{children}</section>
  ),
  article: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <article className={className}>{children}</article>
  ),
  nav: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <nav className={className}>{children}</nav>
  ),
  main: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <main className={className}>{children}</main>
  ),
  figure: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <figure className={className}>{children}</figure>
  ),
  figcaption: ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <figcaption className={className}>{children}</figcaption>
  ),
  time: ({ children, dateTime, className = "" }: { children: ReactNode; dateTime: string; className?: string }) => (
    <time dateTime={dateTime} className={className}>{children}</time>
  ),
};

/**
 * Generate Hreflang tags for international SEO
 */
export const HrefLangTags = ({
  currentUrl,
  alternates,
}: {
  currentUrl: string;
  alternates: Record<string, string>;
}) => {
  return (
    <>
      <link rel="canonical" href={currentUrl} />
      {Object.entries(alternates).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
    </>
  );
};

/**
 * Performance & SEO metrics tracking
 */
export const SEOMetrics = {
  trackPageView: (path: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: path,
      });
    }
  },
  trackConversion: (conversionId: string, label: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        conversion_id: conversionId,
        conversion_label: label,
      });
    }
  },
};
