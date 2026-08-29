import React, { useEffect } from "react";
import { SuburbInfo } from "@/data/suburbsData";

export interface SEOProps {
  suburb?: SuburbInfo;
  canonicalPath?: string;
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogType?: "website" | "article" | "business.business";
  ogImage?: string;
  suburbName?: string;
  postcode?: string;
  faqs?: Array<{ q: string; a: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  geoCoordinates?: { latitude: number; longitude: number };
}

export function updateMetaTag(attributeName: "name" | "property", attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export function SEO({
  suburb,
  canonicalPath,
  title: propTitle,
  description: propDescription,
  canonicalUrl: propCanonicalUrl,
  keywords: propKeywords,
  ogType = "website",
  ogImage = "/images/hero-taxi.png",
  suburbName: propSuburbName,
  postcode: propPostcode,
  faqs: propFaqs,
  breadcrumbs: propBreadcrumbs,
  geoCoordinates,
}: SEOProps) {
  const title = propTitle || (suburb ? suburb.metaTitle : "Melbourne Taxis | 24/7 Cab Booking & Airport Transfers");
  const description = propDescription || (suburb ? suburb.metaDesc : "Book Melbourne Taxis 24/7 across all Melbourne suburbs. Fast pickups, fixed fares to Melbourne Airport, Maxi Cabs, and Silver Service.");
  const keywords = propKeywords || (suburb ? suburb.keywords : []);
  const suburbName = propSuburbName || (suburb ? suburb.name : undefined);
  const postcode = propPostcode || (suburb ? suburb.postcode : undefined);
  const faqs = propFaqs || (suburb ? suburb.faqs : []);
  const breadcrumbs = propBreadcrumbs || (suburb ? [
    { name: "Home", url: "/" },
    { name: "Service Areas", url: "/service-areas" },
    { name: suburb.name, url: `/service-areas/${suburb.id}` }
  ] : []);

  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // 2. Standard Meta Tags
    updateMetaTag("name", "description", description);
    if (keywords && keywords.length > 0) {
      updateMetaTag("name", "keywords", keywords.join(", "));
    }
    updateMetaTag("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // 3. Local Search & Geo Tags
    if (suburbName) {
      updateMetaTag("name", "geo.region", "AU-VIC");
      updateMetaTag("name", "geo.placename", `${suburbName}, Melbourne, Victoria, Australia`);
      if (geoCoordinates) {
        updateMetaTag("name", "geo.position", `${geoCoordinates.latitude};${geoCoordinates.longitude}`);
        updateMetaTag("name", "ICBM", `${geoCoordinates.latitude}, ${geoCoordinates.longitude}`);
      }
    }

    // 4. Open Graph Tags
    const origin = typeof window !== "undefined" ? window.location.origin : "https://melbournetaxis.com.au";
    const fullUrl = propCanonicalUrl || (canonicalPath ? `${origin}${canonicalPath}` : (typeof window !== "undefined" ? window.location.href : "https://melbournetaxis.com.au"));
    const absoluteImageUrl = ogImage.startsWith("http") ? ogImage : `${origin}${ogImage}`;

    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:type", ogType);
    updateMetaTag("property", "og:url", fullUrl);
    updateMetaTag("property", "og:image", absoluteImageUrl);
    updateMetaTag("property", "og:image:alt", `${title} - Melbourne Taxis`);
    updateMetaTag("property", "og:site_name", "Melbourne Taxis");
    updateMetaTag("property", "og:locale", "en_AU");

    // 5. Twitter Card Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", title);
    updateMetaTag("name", "twitter:description", description);
    updateMetaTag("name", "twitter:image", absoluteImageUrl);
    updateMetaTag("name", "twitter:image:alt", `${title} - Melbourne Taxis`);

    // 6. Canonical URL Link
    updateCanonicalLink(fullUrl);

    // 7. Structured Data (Schema.org JSON-LD Graph)
    const scriptId = "page-seo-schema-ld";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const schemaGraph: any[] = [
      {
        "@type": "TaxiService",
        "@id": `${fullUrl}#service`,
        name: suburbName ? `Melbourne Taxis - Taxi in ${suburbName}` : "Melbourne Taxis",
        description: description,
        url: fullUrl,
        provider: {
          "@type": "LocalBusiness",
          name: "Melbourne Taxis",
          telephone: "+61435304821",
          email: "melbournewestcab@gmail.com",
          priceRange: "$$",
          image: absoluteImageUrl,
          currenciesAccepted: "AUD",
          paymentAccepted: "Cash, Credit Card, EFTPOS, Apple Pay, Google Pay, Cabcharge",
          address: {
            "@type": "PostalAddress",
            addressLocality: suburbName || "Melbourne",
            addressRegion: "VIC",
            postalCode: postcode ? postcode.replace(/[^0-9]/g, "") : "3000",
            addressCountry: "AU",
          },
          ...(geoCoordinates && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: geoCoordinates.latitude,
              longitude: geoCoordinates.longitude,
            },
          }),
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: suburbName || "Greater Melbourne",
        },
        serviceType: [
          `Taxi in ${suburbName || "Melbourne"}`,
          "Airport Transfers (Tullamarine & Avalon)",
          "Maxi Taxi Group Transport",
          "Silver Service Executive Chauffeur",
          "Door to Door 24/7 Cab Service",
        ],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
    ];

    // Add Breadcrumb schema if provided
    if (breadcrumbs.length > 0) {
      schemaGraph.push({
        "@type": "BreadcrumbList",
        "@id": `${fullUrl}#breadcrumbs`,
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith("http") ? crumb.url : `${origin}${crumb.url}`,
        })),
      });
    }

    // Add FAQ schema if provided
    if (faqs.length > 0) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${fullUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      });
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph,
    });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [
    title,
    description,
    canonicalPath,
    propCanonicalUrl,
    keywords,
    ogType,
    ogImage,
    suburbName,
    postcode,
    faqs,
    breadcrumbs,
    geoCoordinates,
  ]);

  return null;
}
